import AppError from '../../errors/appError';
import { User } from '../UsersRegistration/userRegistration.model';
import { encryptMemberApplicationPayload } from './memberApplications.encriptor';
import { TMemberApplications } from './memberApplications.interface';
import httpStatus from 'http-status-codes';
import { MemberApplications } from './memberApplications.model';
import { JwtPayload } from 'jsonwebtoken';
import { decryptMemberApplicationPayload } from './memberApplications.decryptor';
import { USER_ROLE } from '../UsersRegistration/user.constent';
import { encryptObjectFields } from '../../utils/encryptObjectFields';
import { encrypt } from '../../utils/encryption.utils';

const createMemberIntoDB = async (
  userData: JwtPayload,
  payload: TMemberApplications,
) => {
  const userExists = await User.findById({ _id: userData?._id });

  if (!userExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User account is not created. Please go back previous step.',
    );
  }

  const isAdminOrSuperAdmin =
    userExists?.role === USER_ROLE.admin ||
    userExists?.role === USER_ROLE.superAdmin;

  const duplicateApplication = await MemberApplications.findOne({
    userId: userData?._id,
  });

  if (duplicateApplication && !isAdminOrSuperAdmin) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have already applied for Individual Subscriber Enrollment.',
    );
  }

  if (userExists?.role !== USER_ROLE.member && !isAdminOrSuperAdmin) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Your account has been registered as a ${userExists?.role}. So you are not application for Member Application`,
    );
  }

  // Encrypt sensitive fields before saving
  const encrypteddata = encryptMemberApplicationPayload(payload);

  const data = {
    ...encrypteddata,
    userId: userData?._id,
  };
  const createApplication = await MemberApplications.create(data);

  const applicationResponceData = {
    _id: createApplication?._id,
    paymentMethod: createApplication?.paymentMethod,
    onboardingFee: createApplication?.onboardingFee,
  };

  return applicationResponceData;

  //   const jwtPayload = {
  //     email,
  //     role: role,
  //     _id: user?._id,
  //   };
  //   //===========> create token and sent to the client
  //   const resetToken = createToken(
  //     jwtPayload,
  //     config.jwt_access_secret as string,
  //     '20m',
  //   );

  //   const resetUILink = `${config.email_vErification_ui_link}?email=${email}&token=${resetToken}`;

  //   const subject = 'Verification email from Care Points Card Global.';

  //   const html = `
  //   <body style="margin:0; padding:0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#f4f4f4;">
  //   <div style="max-width:600px; margin:40px auto; background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

  //     <!-- Header -->
  //     <div style="background-color:#0072C6; color:#ffffff; text-align:center; padding:25px;">
  //       <h2 style="margin:0; font-size:24px;">Welcome to Care Points Global</h2>
  //       <p style="margin:5px 0 0; font-size:14px; opacity:0.85;">Secure your account by verifying your email</p>
  //     </div>

  //     <!-- Body -->
  //     <div style="padding:25px; color:#333333;">
  //       <h3 style="font-size:18px; margin-bottom:15px;">Hello Dear,</h3>
  //       <p style="line-height:1.6; margin-bottom:20px;">
  //         Thank you for registering with us! To complete your registration and activate your account, please verify your email address by clicking the button below:
  //       </p>

  //       <p style="text-align:center; margin-bottom:20px;">
  //         <a href="${resetUILink}" style="display:inline-block; padding:12px 25px; font-size:16px; color:#ffffff; background-color:#0072C6; border-radius:5px; text-decoration:none;">Verify Email</a>
  //       </p>

  //       <p style="line-height:1.6; margin-bottom:0;">
  //         If you did not create this account, you can safely ignore this email.
  //       </p>

  //       <p style="margin-top:20px;">Best regards,<br>The Care Points Global Team</p>
  //     </div>

  //     <!-- Footer -->
  //     <div style="text-align:center; background-color:#f4f4f4; padding:20px; font-size:12px; color:#888888;">
  //       <p style="margin:0;">&copy; 2026 Care Points Global</p>
  //       <p style="margin:10px 0;">
  //         <a href="#" style="color:#0072C6; text-decoration:none; margin:0 5px;">Privacy Policy</a> |
  //         <a href="#" style="color:#0072C6; text-decoration:none; margin:0 5px;">Terms of Service</a> |
  //         <a href="#" style="color:#0072C6; text-decoration:none; margin:0 5px;">Help Center</a>
  //       </p>
  //     </div>

  //   </div>
  // </body>
  // `;

  //   sendEmail(subject, email, html);
};

const getSingleMemberApplicationFromDB = async (userData: JwtPayload) => {
  const userExists = await User.findById({ _id: userData?._id });

  if (!userExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User account is not found.');
  }

  const applicationData = await MemberApplications.findOne({
    userId: userData?._id,
  });

  if (applicationData?.isDeleted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Your application has been deactivated. Please contact an administrator to discuss restoration options. Thank you for your patience.',
    );
  }

  if (applicationData) {
    const result = decryptMemberApplicationPayload(applicationData);
    return result;
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Application informaion not found.',
    );
  }
};

const getAllMemberApplicationFromDB = async (userData: JwtPayload) => {
  const userExists = await User.findById(userData._id);

  if (!userExists) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User account not found.');
  }

  // Only admin / superAdmin can access
  if (
    userExists.role !== USER_ROLE.superAdmin &&
    userExists.role !== USER_ROLE.admin
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Access denied. You do not have permission to view member applications.',
    );
  }

  const applicationData = await MemberApplications.find().lean();

  if (!applicationData.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No member applications found.');
  }

  // 🔓 Decrypt each application
  const result = applicationData.map((app) =>
    decryptMemberApplicationPayload(app),
  );

  return result;
};

export const updateMemberApplicationFromDB = async (
  userData: JwtPayload,
  applicationId: string,
  payload: Partial<TMemberApplications>,
) => {
  const application = await MemberApplications.findById(applicationId);

  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, 'Application not found.');
  }

  const isOwner = application.userId.toString() === userData._id;
  const isAdmin =
    userData.role === USER_ROLE.admin || userData.role === USER_ROLE.superAdmin;

  if (!isOwner && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, 'Access denied.');
  }

  if (payload?.isPaid === true && !isAdmin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Paid option can update only Admin or Super Admin.',
    );
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

  // 🔐 Fields to encrypt
  const encryptedPayload = {
    ...encryptObjectFields<TMemberApplications>(payload, [
      'fullName',
      'dateOfBirth',
      'gender',
      'phoneNumber',
      'whatsappNumber',
      'fullAddress',
      'countryOfResidence',
      'cityOrRegion',
      'membershipTier',
      'currentHealthStatus',
      'currentMedications',
      'existingConditions',
      'bloodTestLocationPreference',
      'preferredConsultationDate',
      'preferredConsultationTime',
    ]),

    ...(payload.familyMembers && {
      familyMembers: payload.familyMembers.map((member) => ({
        fullName: encrypt(member.fullName),
        relationship: encrypt(member.relationship),
        dateOfBirth: member.dateOfBirth
          ? encrypt(member.dateOfBirth.toString())
          : undefined,
      })),
    }),
    isDeleted: payload?.isDeleted,
  };

  const updatedApplication = await MemberApplications.findByIdAndUpdate(
    applicationId,
    { $set: encryptedPayload },
    { new: true, runValidators: true },
  ).lean();

  const result = decryptMemberApplicationPayload(updatedApplication!);

  return result;
};

export const deleteMemberApplicationFromDB = async (
  userData: JwtPayload,
  applicationId: string,
) => {
  const application = await MemberApplications.findById(applicationId);

  if (!application || application.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Application not found.');
  }

  const isOwner = application.userId.toString() === userData._id;
  const isAdminOrSuperAdmin =
    userData.role === USER_ROLE.admin || userData.role === USER_ROLE.superAdmin;

  if (!isOwner && !isAdminOrSuperAdmin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not allowed to delete this application.',
    );
  }

  application.isDeleted = true;

  await application.save();

  return {
    message: 'Application deleted successfully.',
  };
};

const getMemberApplicationWithEmailFromDB = async (email: string) => {
  const userExists = await User.findOne({ email });

  if (!userExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invaid Email Address.');
  }

  const applicationData = await MemberApplications.find({
    userId: userExists?._id,
  });

  if (!applicationData.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'No application found under this email.',
    );
  }

  // 🔓 Decrypt each application
  const result = applicationData.map((app) =>
    decryptMemberApplicationPayload(app),
  );

  return result;
};

export const memberServices = {
  createMemberIntoDB,
  getSingleMemberApplicationFromDB,
  getAllMemberApplicationFromDB,
  deleteMemberApplicationFromDB,
  getMemberApplicationWithEmailFromDB,
  updateMemberApplicationFromDB,
};
