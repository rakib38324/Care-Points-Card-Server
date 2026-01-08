"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberServices = exports.deleteMemberApplicationFromDB = exports.updateMemberApplicationFromDB = void 0;
const appError_1 = __importDefault(require("../../errors/appError"));
const userRegistration_model_1 = require("../UsersRegistration/userRegistration.model");
const memberApplications_encriptor_1 = require("./memberApplications.encriptor");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const memberApplications_model_1 = require("./memberApplications.model");
const memberApplications_decryptor_1 = require("./memberApplications.decryptor");
const user_constent_1 = require("../UsersRegistration/user.constent");
const encryptObjectFields_1 = require("../../utils/encryptObjectFields");
const encryption_utils_1 = require("../../utils/encryption.utils");
const createMemberIntoDB = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.findById({ _id: userData === null || userData === void 0 ? void 0 : userData._id });
    if (!userExists) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User account is not created. Please go back previous step.');
    }
    const isAdminOrSuperAdmin = (userExists === null || userExists === void 0 ? void 0 : userExists.role) === user_constent_1.USER_ROLE.admin ||
        (userExists === null || userExists === void 0 ? void 0 : userExists.role) === user_constent_1.USER_ROLE.superAdmin;
    const duplicateApplication = yield memberApplications_model_1.MemberApplications.findOne({
        userId: userData === null || userData === void 0 ? void 0 : userData._id,
    });
    if (duplicateApplication && !isAdminOrSuperAdmin) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'You have already applied for Individual Subscriber Enrollment.');
    }
    // Encrypt sensitive fields before saving
    const encrypteddata = (0, memberApplications_encriptor_1.encryptMemberApplicationPayload)(payload);
    const data = Object.assign(Object.assign({}, encrypteddata), { userId: userData === null || userData === void 0 ? void 0 : userData._id });
    const createApplication = yield memberApplications_model_1.MemberApplications.create(data);
    const applicationResponceData = {
        _id: createApplication === null || createApplication === void 0 ? void 0 : createApplication._id,
        paymentMethod: createApplication === null || createApplication === void 0 ? void 0 : createApplication.paymentMethod,
        onboardingFee: createApplication === null || createApplication === void 0 ? void 0 : createApplication.onboardingFee,
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
});
const getSingleMemberApplicationFromDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.findById({ _id: userData === null || userData === void 0 ? void 0 : userData._id });
    if (!userExists) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User account is not found.');
    }
    const applicationData = yield memberApplications_model_1.MemberApplications.findOne({
        userId: userData === null || userData === void 0 ? void 0 : userData._id,
    });
    if (applicationData === null || applicationData === void 0 ? void 0 : applicationData.isDeleted) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your application has been deactivated. Please contact an administrator to discuss restoration options. Thank you for your patience.");
    }
    if (applicationData) {
        const result = (0, memberApplications_decryptor_1.decryptMemberApplicationPayload)(applicationData);
        return result;
    }
    else {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Application informaion not found.');
    }
});
const getAllMemberApplicationFromDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.findById(userData._id);
    if (!userExists) {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'User account not found.');
    }
    // Only admin / superAdmin can access
    if (userExists.role !== user_constent_1.USER_ROLE.superAdmin &&
        userExists.role !== user_constent_1.USER_ROLE.admin) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Access denied. You do not have permission to view member applications.');
    }
    const applicationData = yield memberApplications_model_1.MemberApplications.find().lean();
    if (!applicationData.length) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'No member applications found.');
    }
    // 🔓 Decrypt each application
    const result = applicationData.map((app) => (0, memberApplications_decryptor_1.decryptMemberApplicationPayload)(app));
    return result;
});
const updateMemberApplicationFromDB = (userData, applicationId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield memberApplications_model_1.MemberApplications.findById(applicationId);
    if (!application) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Application not found.');
    }
    const isOwner = application.userId.toString() === userData._id;
    const isAdmin = userData.role === user_constent_1.USER_ROLE.admin || userData.role === user_constent_1.USER_ROLE.superAdmin;
    if (!isOwner && !isAdmin) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Access denied.');
    }
    if ((payload === null || payload === void 0 ? void 0 : payload.isPaid) === true && !isAdmin) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Paid option can update only Admin or Super Admin.');
    }
    // 🔐 Fields to encrypt
    const encryptedPayload = Object.assign(Object.assign(Object.assign({}, (0, encryptObjectFields_1.encryptObjectFields)(payload, [
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
    ])), (payload.familyMembers && {
        familyMembers: payload.familyMembers.map((member) => ({
            fullName: (0, encryption_utils_1.encrypt)(member.fullName),
            relationship: (0, encryption_utils_1.encrypt)(member.relationship),
            dateOfBirth: member.dateOfBirth
                ? (0, encryption_utils_1.encrypt)(member.dateOfBirth.toString())
                : undefined,
        })),
    })), { isDeleted: payload === null || payload === void 0 ? void 0 : payload.isDeleted });
    const updatedApplication = yield memberApplications_model_1.MemberApplications.findByIdAndUpdate(applicationId, { $set: encryptedPayload }, { new: true, runValidators: true }).lean();
    const result = (0, memberApplications_decryptor_1.decryptMemberApplicationPayload)(updatedApplication);
    return result;
});
exports.updateMemberApplicationFromDB = updateMemberApplicationFromDB;
const deleteMemberApplicationFromDB = (userData, applicationId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield memberApplications_model_1.MemberApplications.findById(applicationId);
    if (!application || application.isDeleted) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Application not found.');
    }
    const isOwner = application.userId.toString() === userData._id;
    const isAdminOrSuperAdmin = userData.role === user_constent_1.USER_ROLE.admin || userData.role === user_constent_1.USER_ROLE.superAdmin;
    if (!isOwner && !isAdminOrSuperAdmin) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'You are not allowed to delete this application.');
    }
    application.isDeleted = true;
    yield application.save();
    return {
        message: 'Application deleted successfully.',
    };
});
exports.deleteMemberApplicationFromDB = deleteMemberApplicationFromDB;
const getMemberApplicationWithEmailFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.findOne({ email });
    if (!userExists) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Invaid Email Address.');
    }
    const applicationData = yield memberApplications_model_1.MemberApplications.find({
        userId: userExists === null || userExists === void 0 ? void 0 : userExists._id,
    });
    if (!applicationData.length) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'No application found under this email.');
    }
    // 🔓 Decrypt each application
    const result = applicationData.map((app) => (0, memberApplications_decryptor_1.decryptMemberApplicationPayload)(app));
    return result;
});
exports.memberServices = {
    createMemberIntoDB,
    getSingleMemberApplicationFromDB,
    getAllMemberApplicationFromDB,
    deleteMemberApplicationFromDB: exports.deleteMemberApplicationFromDB,
    getMemberApplicationWithEmailFromDB,
    updateMemberApplicationFromDB: exports.updateMemberApplicationFromDB
};
