import httpStatus from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/appError';
import { USER_ROLE } from '../UsersRegistration/user.constent';
import { User } from '../UsersRegistration/userRegistration.model';
import { TNGOApplication } from './ngoApplication.interface';
import { NGOApplication } from './ngoApplication.model'; // You will need to create this
import { encryptObjectFields } from '../../utils/encryptObjectFields';
import { encrypt } from '../../utils/encryption.utils';
import { encryptNGOApplicationPayload } from './ngoApplication.encriptor';
import { decryptNGOApplicationPayload } from './ngoApplication.decryptor';

/**
 * Create a new NGO Application
 */
const createNGOApplicationIntoDB = async (
  userData: JwtPayload,
  payload: TNGOApplication,
) => {
  const userExists = await User.findById(userData?._id);

  if (!userExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User account not found. Please register first.',
    );
  }

  const isAdminOrSuperAdmin =
    userExists?.role === USER_ROLE.admin ||
    userExists?.role === USER_ROLE.superAdmin;

  // Prevent multiple applications unless admin
  const duplicateApplication = await NGOApplication.findOne({
    userId: userData?._id,
  });

  if (duplicateApplication && !isAdminOrSuperAdmin) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Your organization has already submitted an application.',
    );
  }

  // Ensure user has NGO role or is Admin
  if (userExists?.role !== 'ngo' && !isAdminOrSuperAdmin) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Your account is registered as ${userExists?.role}. Only NGO accounts or Admin can apply.`,
    );
  }

  // Encrypt sensitive NGO fields before saving
  const encryptedData = encryptNGOApplicationPayload(payload);

  const data = {
    ...encryptedData,
    userId: userData?._id,
  };

  const createApplication = await NGOApplication.create(data);

  return {
    _id: createApplication?._id,
    organizationName: payload.organizationName, // Returning raw for UI feedback
    paymentMethod: createApplication?.paymentMethod,
    isPaid: createApplication?.isPaid,
  };
};

/**
 * Get a single NGO application for the logged-in user
 */
const getSingleNGOApplicationFromDB = async (userData: JwtPayload) => {
  const applicationData = await NGOApplication.findOne({
    userId: userData?._id,
  });

  if (!applicationData) {
    throw new AppError(httpStatus.NOT_FOUND, 'NGO Application not found.');
  }

  if (applicationData.isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This application has been deactivated. Please contact support.',
    );
  }

  return decryptNGOApplicationPayload(applicationData);
};

/**
 * Get all NGO applications (Admin/SuperAdmin only)
 */
const getAllNGOApplicationsFromDB = async (userData: JwtPayload) => {
  const userExists = await User.findById(userData._id);

  if (
    !userExists ||
    (userExists.role !== USER_ROLE.admin &&
      userExists.role !== USER_ROLE.superAdmin)
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized access.');
  }

  const applications = await NGOApplication.find().lean();

  return applications.map((app) => decryptNGOApplicationPayload(app));
};

/**
 * Update NGO Application
 */
const updateNGOApplicationInDB = async (
  userData: JwtPayload,
  applicationId: string,
  payload: Partial<TNGOApplication>,
) => {
  const application = await NGOApplication.findById(applicationId);

  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, 'Application not found.');
  }

  const isAdmin =
    userData.role === USER_ROLE.admin || userData.role === USER_ROLE.superAdmin;
  const isOwner = application.userId.toString() === userData._id;

  if (!isOwner && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, 'Access denied.');
  }

  // Protect sensitive status fields
  if (payload?.isPaid !== undefined && !isAdmin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Only admins can update payment status.',
    );
  }

  // Encrypt updated fields
  const encryptedPayload = {
    ...encryptObjectFields<TNGOApplication>(payload, [
      // Organization Information
      'organizationName',
      'organizationType',
      'registrationNumber',
      'countryOfRegistration',
      'headquartersAddress',
      'website',

      // Program Details
      'targetCommunityRegion',
      'beneficiaryDemographics',
      'programDuration',

      // Membership Configuration
      'membershipTier',
      'mixedTierBreakdown',
      'beneficiarySelectionCriteria',
      'healthPriorities',
      'healthPrioritiesOtherSpacify',

      // Data & Reporting
      'reportingFrequency',
      'requiredMetrics',
      'dataAccessLevel',

      // Budget & Payment
      'fundingSource',
      'paymentSchedule',
      'paymentMethod',

      // Supporting Documents (URLs)
      'organizationRegistrationCertificate',
      'taxExemptStatus',
      'programProposal',
      'budgetBreakdown',
    ]),

    // 👤 Handle nested Primary Contact fields
    ...(payload?.primaryContact && {
      primaryContact: {
        fullName: payload.primaryContact.fullName
          ? encrypt(payload.primaryContact.fullName)
          : undefined,
        titleOrPosition: payload.primaryContact.titleOrPosition
          ? encrypt(payload.primaryContact.titleOrPosition)
          : undefined,
        email: payload.primaryContact.email
          ? encrypt(payload.primaryContact.email)
          : undefined,
        phoneNumber: payload.primaryContact.phoneNumber
          ? encrypt(payload.primaryContact.phoneNumber)
          : undefined,
        whatsappNumber: payload.primaryContact.whatsappNumber
          ? encrypt(payload.primaryContact.whatsappNumber)
          : undefined,
      },
    }),

    isDeleted: payload?.isDeleted,
    isPaid: payload?.isPaid,
  };

  const updatedDoc = await NGOApplication.findByIdAndUpdate(
    applicationId,
    { $set: encryptedPayload },
    { new: true, runValidators: true },
  ).lean();

  return decryptNGOApplicationPayload(updatedDoc!);
};

/**
 * Soft Delete NGO Application
 */
const deleteNGOApplicationFromDB = async (
  userData: JwtPayload,
  applicationId: string,
) => {
  const application = await NGOApplication.findById(applicationId);

  if (!application || application.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Application not found.');
  }

  const isAdmin =
    userData.role === USER_ROLE.admin || userData.role === USER_ROLE.superAdmin;
  const isOwner = application.userId.toString() === userData._id;

  if (!isOwner && !isAdmin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Unauthorized to delete this application.',
    );
  }

  application.isDeleted = true;
  await application.save();

  return { message: 'NGO Application deleted successfully.' };
};

const getNGOApplicationWithEmailFromDB = async (email: string) => {
  // 1. Verify if the user exists based on the provided email
  const userExists = await User.findOne({ email });

  if (!userExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Email Address.');
  }

  // 2. Find applications associated with that User's ID
  const applicationData = await NGOApplication.find({
    userId: userExists?._id,
  });

  if (!applicationData || applicationData.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'No NGO application found under this email.',
    );
  }

  // 3. Decrypt each application using the NGO-specific decryptor
  const result = applicationData.map((app) =>
    decryptNGOApplicationPayload(app),
  );

  return result;
};

export const ngoApplicationServices = {
  createNGOApplicationIntoDB,
  getSingleNGOApplicationFromDB,
  getAllNGOApplicationsFromDB,
  updateNGOApplicationInDB,
  deleteNGOApplicationFromDB,
  getNGOApplicationWithEmailFromDB,
};
