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
exports.employerApplicationServices = exports.deleteEmployerApplicationFromDB = exports.updateEmployerApplicationFromDB = void 0;
const appError_1 = __importDefault(require("../../errors/appError"));
const userRegistration_model_1 = require("../UsersRegistration/userRegistration.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_constent_1 = require("../UsersRegistration/user.constent");
const encryptObjectFields_1 = require("../../utils/encryptObjectFields");
const encryption_utils_1 = require("../../utils/encryption.utils");
const employerApplication_model_1 = require("./employerApplication.model");
const employerApplication_encriptor_1 = require("./employerApplication.encriptor");
const employerApplication_decrytor_1 = require("./employerApplication.decrytor");
/**
 * ================= Create Employer Application =================
 */
const createEmployerIntoDB = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.findById({ _id: userData === null || userData === void 0 ? void 0 : userData._id });
    if (!userExists) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User account is not created. Please complete registration first.');
    }
    const isAdminOrSuperAdmin = (userExists === null || userExists === void 0 ? void 0 : userExists.role) === user_constent_1.USER_ROLE.admin ||
        (userExists === null || userExists === void 0 ? void 0 : userExists.role) === user_constent_1.USER_ROLE.superAdmin;
    // Prevent multiple corporate applications from the same user
    const duplicateApplication = yield employerApplication_model_1.EmployerApplication.findOne({
        userId: userData === null || userData === void 0 ? void 0 : userData._id,
    });
    if (duplicateApplication && !isAdminOrSuperAdmin) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Your organization has already submitted a application.');
    }
    // Ensure role matches or user is admin
    if ((userExists === null || userExists === void 0 ? void 0 : userExists.role) !== user_constent_1.USER_ROLE.employer && !isAdminOrSuperAdmin) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, `Your account is registered as ${userExists === null || userExists === void 0 ? void 0 : userExists.role}. Only Employers can apply for Group Sponsorship.`);
    }
    // 🔐 Encrypt corporate sensitive fields before saving
    const encryptedData = (0, employerApplication_encriptor_1.encryptEmployerApplicationPayload)(payload);
    const data = Object.assign(Object.assign({}, encryptedData), { userId: userData === null || userData === void 0 ? void 0 : userData._id });
    const createApplication = yield employerApplication_model_1.EmployerApplication.create(data);
    return {
        _id: createApplication === null || createApplication === void 0 ? void 0 : createApplication._id,
        companyName: payload.companyName,
        paymentMethod: createApplication === null || createApplication === void 0 ? void 0 : createApplication.paymentMethod,
        estimatedAnnualCost: createApplication === null || createApplication === void 0 ? void 0 : createApplication.estimatedAnnualCost,
    };
});
/**
 * ================= Get Single Employer Application =================
 */
const getSingleEmployerApplicationFromDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const applicationData = yield employerApplication_model_1.EmployerApplication.findOne({
        userId: userData === null || userData === void 0 ? void 0 : userData._id,
    });
    if (!applicationData) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Employer application information not found.');
    }
    if (applicationData === null || applicationData === void 0 ? void 0 : applicationData.isDeleted) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'This application has been deactivated. Please contact support.');
    }
    // 🔓 Decrypt for the user
    return (0, employerApplication_decrytor_1.decryptEmployerApplicationPayload)(applicationData);
});
/**
 * ================= Get All Employer Applications (Admin) =================
 */
const getAllEmployerApplicationFromDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.findById(userData._id);
    if (!userExists ||
        (userExists.role !== user_constent_1.USER_ROLE.superAdmin &&
            userExists.role !== user_constent_1.USER_ROLE.admin)) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Access denied. Admin only.');
    }
    const applications = yield employerApplication_model_1.EmployerApplication.find().lean();
    if (!applications.length) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'No employer applications found.');
    }
    return applications.map((app) => (0, employerApplication_decrytor_1.decryptEmployerApplicationPayload)(app));
});
/**
 * ================= Update Employer Application =================
 */
const updateEmployerApplicationFromDB = (userData, applicationId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield employerApplication_model_1.EmployerApplication.findById(applicationId);
    if (!application) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Application not found.');
    }
    const isOwner = application.userId.toString() === userData._id;
    const isAdmin = userData.role === user_constent_1.USER_ROLE.admin || userData.role === user_constent_1.USER_ROLE.superAdmin;
    if (!isOwner && !isAdmin) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Unauthorized access.');
    }
    // 🔐 Encrypt updated corporate fields
    const encryptedPayload = Object.assign(Object.assign(Object.assign(Object.assign({}, (0, encryptObjectFields_1.encryptObjectFields)(payload, [
        'companyName',
        'industry',
        'companySize',
        'registrationNumber',
        'countryOfRegistration',
        'headquartersAddress',
        'website',
        'employeeLocations',
        'coverageType',
        'eligibilityCriteria',
        'eligibilityCriteriaOther',
        'membershipTier',
        'membershipTierDetails',
        'onboardingApproach',
        'wellnessPriorities',
        'additionalServicesRequested',
        'dashboardAccess',
        'reportingFrequency',
        'keyMetrics',
        'costSharingModel',
        'paymentSchedule',
        'paymentMethod',
        'desiredStartDate',
        'communicationSupportNeeded',
    ])), (payload.primaryContact && {
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
    })), (payload.openEnrollmentPeriod && {
        openEnrollmentPeriod: {
            start: payload.openEnrollmentPeriod.start
                ? (0, encryption_utils_1.encrypt)(payload.openEnrollmentPeriod.start)
                : undefined,
            end: payload.openEnrollmentPeriod.end
                ? (0, encryption_utils_1.encrypt)(payload.openEnrollmentPeriod.end)
                : undefined,
        },
    })), { isDeleted: payload === null || payload === void 0 ? void 0 : payload.isDeleted, isPaid: isAdmin ? payload === null || payload === void 0 ? void 0 : payload.isPaid : application.isPaid });
    const updatedDoc = yield employerApplication_model_1.EmployerApplication.findByIdAndUpdate(applicationId, { $set: encryptedPayload }, { new: true, runValidators: true }).lean();
    return (0, employerApplication_decrytor_1.decryptEmployerApplicationPayload)(updatedDoc);
});
exports.updateEmployerApplicationFromDB = updateEmployerApplicationFromDB;
/**
 * ================= Delete Employer Application (Soft Delete) =================
 */
const deleteEmployerApplicationFromDB = (userData, applicationId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield employerApplication_model_1.EmployerApplication.findById(applicationId);
    if (!application || application.isDeleted) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Application not found.');
    }
    const isOwner = application.userId.toString() === userData._id;
    const isAdmin = userData.role === user_constent_1.USER_ROLE.admin || userData.role === user_constent_1.USER_ROLE.superAdmin;
    if (!isOwner && !isAdmin) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'You are not allowed to delete this.');
    }
    application.isDeleted = true;
    yield application.save();
    return { message: 'Employer application deleted successfully.' };
});
exports.deleteEmployerApplicationFromDB = deleteEmployerApplicationFromDB;
/**
 * ================= Get Employer Application By Email =================
 */
const getEmployerApplicationWithEmailFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.findOne({ email });
    if (!userExists) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Invalid Email Address.');
    }
    const applications = yield employerApplication_model_1.EmployerApplication.find({
        userId: userExists === null || userExists === void 0 ? void 0 : userExists._id,
    });
    if (!applications.length) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'No corporate applications found for this email.');
    }
    return applications.map((app) => (0, employerApplication_decrytor_1.decryptEmployerApplicationPayload)(app));
});
exports.employerApplicationServices = {
    createEmployerIntoDB,
    getSingleEmployerApplicationFromDB,
    getAllEmployerApplicationFromDB,
    updateEmployerApplicationFromDB: exports.updateEmployerApplicationFromDB,
    deleteEmployerApplicationFromDB: exports.deleteEmployerApplicationFromDB,
    getEmployerApplicationWithEmailFromDB,
};
