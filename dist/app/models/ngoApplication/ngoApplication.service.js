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
exports.ngoApplicationServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../errors/appError"));
const user_constent_1 = require("../UsersRegistration/user.constent");
const userRegistration_model_1 = require("../UsersRegistration/userRegistration.model");
const ngoApplication_model_1 = require("./ngoApplication.model"); // You will need to create this
const encryptObjectFields_1 = require("../../utils/encryptObjectFields");
const encryption_utils_1 = require("../../utils/encryption.utils");
const ngoApplication_encriptor_1 = require("./ngoApplication.encriptor");
const ngoApplication_decryptor_1 = require("./ngoApplication.decryptor");
/**
 * Create a new NGO Application
 */
const createNGOApplicationIntoDB = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.findById(userData === null || userData === void 0 ? void 0 : userData._id);
    if (!userExists) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User account not found. Please register first.');
    }
    const isAdminOrSuperAdmin = (userExists === null || userExists === void 0 ? void 0 : userExists.role) === user_constent_1.USER_ROLE.admin ||
        (userExists === null || userExists === void 0 ? void 0 : userExists.role) === user_constent_1.USER_ROLE.superAdmin;
    // Prevent multiple applications unless admin
    const duplicateApplication = yield ngoApplication_model_1.NGOApplication.findOne({
        userId: userData === null || userData === void 0 ? void 0 : userData._id,
    });
    if (duplicateApplication && !isAdminOrSuperAdmin) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Your organization has already submitted an application.');
    }
    // Ensure user has NGO role or is Admin
    if ((userExists === null || userExists === void 0 ? void 0 : userExists.role) !== 'ngo' && !isAdminOrSuperAdmin) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, `Your account is registered as ${userExists === null || userExists === void 0 ? void 0 : userExists.role}. Only NGO accounts or Admin can apply.`);
    }
    // Encrypt sensitive NGO fields before saving
    const encryptedData = (0, ngoApplication_encriptor_1.encryptNGOApplicationPayload)(payload);
    const data = Object.assign(Object.assign({}, encryptedData), { userId: userData === null || userData === void 0 ? void 0 : userData._id });
    const createApplication = yield ngoApplication_model_1.NGOApplication.create(data);
    return {
        _id: createApplication === null || createApplication === void 0 ? void 0 : createApplication._id,
        organizationName: payload.organizationName, // Returning raw for UI feedback
        paymentMethod: createApplication === null || createApplication === void 0 ? void 0 : createApplication.paymentMethod,
        isPaid: createApplication === null || createApplication === void 0 ? void 0 : createApplication.isPaid,
    };
});
/**
 * Get a single NGO application for the logged-in user
 */
const getSingleNGOApplicationFromDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const applicationData = yield ngoApplication_model_1.NGOApplication.findOne({
        userId: userData === null || userData === void 0 ? void 0 : userData._id,
    });
    if (!applicationData) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'NGO Application not found.');
    }
    if (applicationData.isDeleted) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'This application has been deactivated. Please contact support.');
    }
    return (0, ngoApplication_decryptor_1.decryptNGOApplicationPayload)(applicationData);
});
/**
 * Get all NGO applications (Admin/SuperAdmin only)
 */
const getAllNGOApplicationsFromDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.findById(userData._id);
    if (!userExists || (userExists.role !== user_constent_1.USER_ROLE.admin && userExists.role !== user_constent_1.USER_ROLE.superAdmin)) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Unauthorized access.');
    }
    const applications = yield ngoApplication_model_1.NGOApplication.find().lean();
    return applications.map((app) => (0, ngoApplication_decryptor_1.decryptNGOApplicationPayload)(app));
});
/**
 * Update NGO Application
 */
const updateNGOApplicationInDB = (userData, applicationId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield ngoApplication_model_1.NGOApplication.findById(applicationId);
    if (!application) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Application not found.');
    }
    const isAdmin = userData.role === user_constent_1.USER_ROLE.admin || userData.role === user_constent_1.USER_ROLE.superAdmin;
    const isOwner = application.userId.toString() === userData._id;
    if (!isOwner && !isAdmin) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Access denied.');
    }
    // Protect sensitive status fields
    if ((payload === null || payload === void 0 ? void 0 : payload.isPaid) !== undefined && !isAdmin) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Only admins can update payment status.');
    }
    // Encrypt updated fields
    const encryptedPayload = Object.assign(Object.assign(Object.assign({}, (0, encryptObjectFields_1.encryptObjectFields)(payload, [
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
    ])), ((payload === null || payload === void 0 ? void 0 : payload.primaryContact) && {
        primaryContact: {
            fullName: payload.primaryContact.fullName
                ? (0, encryption_utils_1.encrypt)(payload.primaryContact.fullName)
                : undefined,
            titleOrPosition: payload.primaryContact.titleOrPosition
                ? (0, encryption_utils_1.encrypt)(payload.primaryContact.titleOrPosition)
                : undefined,
            email: payload.primaryContact.email
                ? (0, encryption_utils_1.encrypt)(payload.primaryContact.email)
                : undefined,
            phoneNumber: payload.primaryContact.phoneNumber
                ? (0, encryption_utils_1.encrypt)(payload.primaryContact.phoneNumber)
                : undefined,
            whatsappNumber: payload.primaryContact.whatsappNumber
                ? (0, encryption_utils_1.encrypt)(payload.primaryContact.whatsappNumber)
                : undefined,
        },
    })), { isDeleted: payload === null || payload === void 0 ? void 0 : payload.isDeleted, isPaid: payload === null || payload === void 0 ? void 0 : payload.isPaid });
    const updatedDoc = yield ngoApplication_model_1.NGOApplication.findByIdAndUpdate(applicationId, { $set: encryptedPayload }, { new: true, runValidators: true }).lean();
    return (0, ngoApplication_decryptor_1.decryptNGOApplicationPayload)(updatedDoc);
});
/**
 * Soft Delete NGO Application
 */
const deleteNGOApplicationFromDB = (userData, applicationId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield ngoApplication_model_1.NGOApplication.findById(applicationId);
    if (!application || application.isDeleted) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Application not found.');
    }
    const isAdmin = userData.role === user_constent_1.USER_ROLE.admin || userData.role === user_constent_1.USER_ROLE.superAdmin;
    const isOwner = application.userId.toString() === userData._id;
    if (!isOwner && !isAdmin) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Unauthorized to delete this application.');
    }
    application.isDeleted = true;
    yield application.save();
    return { message: 'NGO Application deleted successfully.' };
});
const getNGOApplicationWithEmailFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Verify if the user exists based on the provided email
    const userExists = yield userRegistration_model_1.User.findOne({ email });
    if (!userExists) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Invalid Email Address.');
    }
    // 2. Find applications associated with that User's ID
    const applicationData = yield ngoApplication_model_1.NGOApplication.find({
        userId: userExists === null || userExists === void 0 ? void 0 : userExists._id,
    });
    if (!applicationData || applicationData.length === 0) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'No NGO application found under this email.');
    }
    // 3. Decrypt each application using the NGO-specific decryptor
    const result = applicationData.map((app) => (0, ngoApplication_decryptor_1.decryptNGOApplicationPayload)(app));
    return result;
});
exports.ngoApplicationServices = {
    createNGOApplicationIntoDB,
    getSingleNGOApplicationFromDB,
    getAllNGOApplicationsFromDB,
    updateNGOApplicationInDB,
    deleteNGOApplicationFromDB,
    getNGOApplicationWithEmailFromDB
};
