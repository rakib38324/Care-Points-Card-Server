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
exports.employerApplicationControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const commonResponse_1 = __importDefault(require("../../utils/commonResponse"));
const employerApplication_service_1 = require("./employerApplication.service");
/**
 * ================= Create Employer Application =================
 */
const createEmployerApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield employerApplication_service_1.employerApplicationServices.createEmployerIntoDB(req.user, req.body);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Employer Group Sponsorship Application Sent Successfully.',
        data: result,
    });
    // Save ID for audit
    res.locals.createdResource = result;
}));
/**
 * ================= Get Single Employer Application =================
 */
const getSingleEmployerApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield employerApplication_service_1.employerApplicationServices.getSingleEmployerApplicationFromDB(req.user);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Employer Application Retrieved Successfully.',
        data: result,
    });
    // Save ID for audit
    res.locals.createdResource = result;
}));
/**
 * ================= Get All Employer Applications =================
 */
const getAllEmployerApplications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield employerApplication_service_1.employerApplicationServices.getAllEmployerApplicationFromDB(req.user);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'All Employer Applications Retrieved Successfully.',
        data: result,
    });
    // Save ID for audit
    res.locals.createdResource = result;
}));
/**
 * ================= Update Employer Application =================
 */
const updateEmployerApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield employerApplication_service_1.employerApplicationServices.updateEmployerApplicationFromDB(req.user, id, req.body);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Employer Application Updated Successfully.',
        data: result,
    });
    // Save ID for audit
    res.locals.createdResource = result;
}));
/**
 * ================= Delete Employer Application =================
 */
const deleteEmployerApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield employerApplication_service_1.employerApplicationServices.deleteEmployerApplicationFromDB(req.user, id);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Employer Application Deleted Successfully.',
        data: result,
    });
    // Save ID for audit
    res.locals.createdResource = result;
}));
/**
 * ================= Get Employer Applications By Email =================
 */
const getEmployerApplicationsWithEmail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const result = yield employerApplication_service_1.employerApplicationServices.getEmployerApplicationWithEmailFromDB(email);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Employer Applications Retrieved Successfully.',
        data: result,
    });
    // Save ID for audit
    res.locals.createdResource = result;
}));
exports.employerApplicationControllers = {
    createEmployerApplication,
    getAllEmployerApplications,
    getSingleEmployerApplication,
    deleteEmployerApplication,
    getEmployerApplicationsWithEmail,
    updateEmployerApplication,
};
