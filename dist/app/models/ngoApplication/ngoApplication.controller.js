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
exports.ngoApplicationControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const commonResponse_1 = __importDefault(require("../../utils/commonResponse"));
const ngoApplication_service_1 = require("./ngoApplication.service");
/**
 * Handle creation of a new NGO application
 */
const createNGOApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ngoApplication_service_1.ngoApplicationServices.createNGOApplicationIntoDB(req.user, req.body);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'NGO Application submitted successfully.',
        data: result,
    });
    // Save ID for audit
    res.locals.createdResource = result;
}));
/**
 * Retrieve the single application belonging to the logged-in user
 */
const getSingleNGOApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ngoApplication_service_1.ngoApplicationServices.getSingleNGOApplicationFromDB(req.user);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'NGO Application retrieved successfully.',
        data: result,
    });
    // Save ID for audit
    res.locals.createdResource = result;
}));
/**
 * Retrieve all NGO applications (Admin/SuperAdmin only)
 */
const getAllNGOApplications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ngoApplication_service_1.ngoApplicationServices.getAllNGOApplicationsFromDB(req.user);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'All NGO Applications retrieved successfully.',
        data: result,
    });
    // Save ID for audit
    res.locals.createdResource = result;
}));
/**
 * Update specific fields of an NGO application
 */
const updateNGOApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield ngoApplication_service_1.ngoApplicationServices.updateNGOApplicationInDB(req.user, id, req.body);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'NGO Application updated successfully.',
        data: result,
    });
    // Save ID for audit
    res.locals.createdResource = result;
}));
/**
 * Soft delete an NGO application
 */
const deleteNGOApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield ngoApplication_service_1.ngoApplicationServices.deleteNGOApplicationFromDB(req.user, id);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'NGO Application deleted successfully.',
        data: result,
    });
    // Save ID for audit
    res.locals.createdResource = result;
}));
/**
 * Retrieve NGO applications with email (Admin/SuperAdmin only)
 */
const getNGOApplicationsWithEmail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const result = yield ngoApplication_service_1.ngoApplicationServices.getNGOApplicationWithEmailFromDB(email);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'NGO Applications retrieved successfully.',
        data: result,
    });
    // Save ID for audit
    res.locals.createdResource = result;
}));
exports.ngoApplicationControllers = {
    createNGOApplication,
    getSingleNGOApplication,
    getAllNGOApplications,
    updateNGOApplication,
    deleteNGOApplication,
    getNGOApplicationsWithEmail,
};
