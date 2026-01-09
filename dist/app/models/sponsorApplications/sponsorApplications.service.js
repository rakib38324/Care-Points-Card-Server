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
exports.SponsorApplicationServices = void 0;
const appError_1 = __importDefault(require("../../errors/appError"));
const userRegistration_model_1 = require("../UsersRegistration/userRegistration.model");
const encryptObjectFields_1 = require("../../utils/encryptObjectFields");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_constent_1 = require("../UsersRegistration/user.constent");
const sponsorApplications_model_1 = require("./sponsorApplications.model");
const sponsorApplications_encriptor_1 = require("./sponsorApplications.encriptor");
const sponsorApplications_decryptor_1 = require("./sponsorApplications.decryptor");
const createSponsorIntoDB = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.findById(userData === null || userData === void 0 ? void 0 : userData._id);
    if (!userExists) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User account is not found. Please register first.');
    }
    const isAdminOrSuperAdmin = (userExists === null || userExists === void 0 ? void 0 : userExists.role) === user_constent_1.USER_ROLE.admin ||
        (userExists === null || userExists === void 0 ? void 0 : userExists.role) === user_constent_1.USER_ROLE.superAdmin;
    if ((userExists === null || userExists === void 0 ? void 0 : userExists.role) !== user_constent_1.USER_ROLE.sponsor && !isAdminOrSuperAdmin) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, `Your account has been registered as a ${userExists === null || userExists === void 0 ? void 0 : userExists.role}. So you are not application for Spondor Application`);
    }
    const duplicateApplication = yield sponsorApplications_model_1.SponsorApplications.findOne({
        userId: userData._id,
    });
    if (duplicateApplication && !isAdminOrSuperAdmin) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'You have already apply for Sponsor application.');
    }
    // Encrypt sensitive fields before saving
    const encryptedData = (0, sponsorApplications_encriptor_1.encryptSponsorPayload)(payload);
    const data = Object.assign(Object.assign({}, encryptedData), { userId: userData._id });
    const createApplication = yield sponsorApplications_model_1.SponsorApplications.create(data);
    return {
        _id: createApplication._id,
        paymentMethod: createApplication.paymentMethod,
        totalOnboardingFees: createApplication.totalOnboardingFees,
    };
});
const getSingleSponsorApplicationFromDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.findById({ _id: userData === null || userData === void 0 ? void 0 : userData._id });
    if (!userExists) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User account is not found.');
    }
    const applicationData = yield sponsorApplications_model_1.SponsorApplications.findOne({
        userId: userData._id,
    });
    if (!applicationData) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Application not found or has been deactivated.');
    }
    if (applicationData.isDeleted) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Application is deactivated. Please contact with admin.');
    }
    return (0, sponsorApplications_decryptor_1.decryptSponsorPayload)(applicationData);
});
const getAllSponsorApplicationsFromDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.findById(userData._id);
    if (!userExists) {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'User account not found.');
    }
    const applicationData = yield sponsorApplications_model_1.SponsorApplications.find().lean();
    if (!applicationData.length) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'No  Sponsor applications found.');
    }
    return applicationData.map((app) => (0, sponsorApplications_decryptor_1.decryptSponsorPayload)(app));
});
const updateSponsorApplicationFromDB = (userData, applicationId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield sponsorApplications_model_1.SponsorApplications.findById({
        _id: applicationId,
    });
    if (!application) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Application not found.');
    }
    const isOwner = application.userId.toString() === userData._id;
    const isAdmin = [user_constent_1.USER_ROLE.admin, user_constent_1.USER_ROLE.superAdmin].includes(userData.role);
    if (!isOwner && !isAdmin) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Access denied.');
    }
    if (((payload === null || payload === void 0 ? void 0 : payload.isDeleted) === true || (payload === null || payload === void 0 ? void 0 : payload.isDeleted) === false) &&
        !isAdmin) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Delete option can update only Admin or Super Admin.');
    }
    // Encrypt sensitive fields
    const encryptedPayload = Object.assign(Object.assign(Object.assign({}, (0, encryptObjectFields_1.encryptObjectFields)(payload, [
        'fullName',
        'phoneNumber',
        'whatsappNumber',
        'fullAddress',
        'countryOfResidence',
        'city',
        'primaryContact',
        'preferredCommunicationMethod',
    ])), (payload.sponsoredMembers && {
        sponsoredMembers: payload.sponsoredMembers.map((member) => (Object.assign({}, (0, encryptObjectFields_1.encryptObjectFields)(member, [
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
        ])))),
    })), { isDeleted: payload.isDeleted, isPaid: payload.isPaid });
    const updatedApplication = yield sponsorApplications_model_1.SponsorApplications.findByIdAndUpdate(applicationId, { $set: encryptedPayload }, { new: true, runValidators: true }).lean();
    return (0, sponsorApplications_decryptor_1.decryptSponsorPayload)(updatedApplication);
});
const deleteSponsorApplicationFromDB = (userData, applicationId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield sponsorApplications_model_1.SponsorApplications.findById(applicationId);
    if (!application || application.isDeleted) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Application not found.');
    }
    const isAdminOrSuperAdmin = [user_constent_1.USER_ROLE.admin, user_constent_1.USER_ROLE.superAdmin].includes(userData.role);
    if (!isAdminOrSuperAdmin) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'You are not allowed to delete this application.');
    }
    application.isDeleted = true;
    yield application.save();
    return { message: 'Application deleted successfully.' };
});
const getSponsorApplicationWithEmailFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.findOne({ email });
    if (!userExists) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Invalid Email Address.');
    }
    const applicationData = yield sponsorApplications_model_1.SponsorApplications.find({
        userId: userExists._id,
    });
    if (!applicationData.length) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'No application found under this email.');
    }
    return applicationData.map((app) => (0, sponsorApplications_decryptor_1.decryptSponsorPayload)(app));
});
exports.SponsorApplicationServices = {
    createSponsorIntoDB,
    getSingleSponsorApplicationFromDB,
    getAllSponsorApplicationsFromDB,
    updateSponsorApplicationFromDB,
    deleteSponsorApplicationFromDB,
    getSponsorApplicationWithEmailFromDB,
};
