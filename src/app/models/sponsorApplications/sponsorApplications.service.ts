import AppError from '../../errors/appError';
import { User } from '../UsersRegistration/userRegistration.model';
import { encryptObjectFields } from '../../utils/encryptObjectFields';
import { encrypt } from '../../utils/encryption.utils';
import { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import { USER_ROLE } from '../UsersRegistration/user.constent';
import { TSponsorApplication } from './sponsorApplications.interface';
import { SponsorApplications } from './sponsorApplications.model';
import { encryptSponsorPayload } from './sponsorApplication.encriptor';
import { decryptSponsorPayload } from './sponsorApplications.decryptor';

const createSponsorIntoDB = async (
  userData: JwtPayload,
  payload: TSponsorApplication,
) => {
  const userExists = await User.findById(userData?._id);

  if (!userExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User account is not found. Please register first.',
    );
  }

  const isAdminOrSuperAdmin =
    userExists?.role === USER_ROLE.admin ||
    userExists?.role === USER_ROLE.superAdmin;

  if (userExists?.role !== USER_ROLE.sponsor && !isAdminOrSuperAdmin) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Your account has been registered as a ${userExists?.role}. So you are not application for Spondor Application`,
    );
  }

  const duplicateApplication = await SponsorApplications.findOne({
    userId: userData._id,
  });

  if (duplicateApplication && !isAdminOrSuperAdmin) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have already apply for Sponsor application.',
    );
  }

  // Encrypt sensitive fields before saving
  const encryptedData = encryptSponsorPayload(payload);

  const data = {
    ...encryptedData,
    userId: userData._id,
  };

  const createApplication = await SponsorApplications.create(data);

  return {
    _id: createApplication._id,
    paymentMethod: createApplication.paymentMethod,
    totalOnboardingFees: createApplication.totalOnboardingFees,
  };
};

const getSingleSponsorApplicationFromDB = async (userData: JwtPayload) => {
  const userExists = await User.findById({ _id: userData?._id });

  if (!userExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User account is not found.');
  }

  const applicationData = await SponsorApplications.findOne({
    userId: userData._id,
  });

  if (!applicationData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Application not found or has been deactivated.',
    );
  }
  if (applicationData.isDeleted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Application is deactivated. Please contact with admin.',
    );
  }

  return decryptSponsorPayload(applicationData);
};

const getAllSponsorApplicationsFromDB = async (userData: JwtPayload) => {
  const userExists = await User.findById(userData._id);

  if (!userExists) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User account not found.');
  }

  const applicationData = await SponsorApplications.find().lean();

  if (!applicationData.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No  Sponsor applications found.');
  }

  return applicationData.map((app) => decryptSponsorPayload(app));
};

const updateSponsorApplicationFromDB = async (
  userData: JwtPayload,
  applicationId: string,
  payload: TSponsorApplication,
) => {
  const application = await SponsorApplications.findById({
    _id: applicationId,
  });

  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, 'Application not found.');
  }

  const isOwner = application.userId.toString() === userData._id;
  const isAdmin = [USER_ROLE.admin, USER_ROLE.superAdmin].includes(
    userData.role,
  );

  if (!isOwner && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, 'Access denied.');
  }

  if (
    (payload?.isDeleted === true || payload?.isDeleted === false) &&
    !isAdmin
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Delete option can update only Admin or Super Admin.',
    );
  }

  // Encrypt sensitive fields
  const encryptedPayload = {
    ...encryptObjectFields<TSponsorApplication>(payload, [
      'fullName',
      'phoneNumber',
      'whatsappNumber',
      'fullAddress',
      'countryOfResidence',
      'city',
      'primaryContact',
      'preferredCommunicationMethod',
    ]),
    ...(payload.sponsoredMembers && {
      sponsoredMembers: payload.sponsoredMembers.map((member) => ({
        ...encryptObjectFields(member, [
          'fullName',
          'relationship',
          'dateOfBirth',
          'gender',
          'countryOfResidence',
          'cityOrRegion',
          'phoneNumber',
          'email',
          'homeAddress',
          'currentHealthStatus',
          'membershipTier',
          'existingConditions',
        ]),
      })),
    }),
    isDeleted: payload.isDeleted,
    isPaid: payload.isPaid,
  };

  const updatedApplication = await SponsorApplications.findByIdAndUpdate(
    applicationId,
    { $set: encryptedPayload },
    { new: true, runValidators: true },
  ).lean();

  return decryptSponsorPayload(updatedApplication!);
};

const deleteSponsorApplicationFromDB = async (
  userData: JwtPayload,
  applicationId: string,
) => {
  const application = await SponsorApplications.findById(applicationId);

  if (!application || application.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Application not found.');
  }

  const isAdminOrSuperAdmin = [USER_ROLE.admin, USER_ROLE.superAdmin].includes(
    userData.role,
  );

  if (!isAdminOrSuperAdmin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not allowed to delete this application.',
    );
  }

  application.isDeleted = true;
  await application.save();

  return { message: 'Application deleted successfully.' };
};

const getSponsorApplicationWithEmailFromDB = async (email: string) => {
  const userExists = await User.findOne({ email });

  if (!userExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Email Address.');
  }

  const applicationData = await SponsorApplications.find({
    userId: userExists._id,
  });

  if (!applicationData.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'No application found under this email.',
    );
  }

  return applicationData.map((app) => decryptSponsorPayload(app));
};

export const SponsorApplicationServices = {
  createSponsorIntoDB,
  getSingleSponsorApplicationFromDB,
  getAllSponsorApplicationsFromDB,
  updateSponsorApplicationFromDB,
  deleteSponsorApplicationFromDB,
  getSponsorApplicationWithEmailFromDB,
};
