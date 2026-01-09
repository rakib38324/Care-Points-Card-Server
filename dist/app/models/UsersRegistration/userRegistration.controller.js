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
exports.userControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const commonResponse_1 = __importDefault(require("../../utils/commonResponse"));
const userRegistration_service_1 = require("./userRegistration.service");
const config_1 = __importDefault(require("../../config/config"));
const createUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield userRegistration_service_1.UserServices.createUserIntoDB(req.body);
    res.cookie('refreshToken', result === null || result === void 0 ? void 0 : result.refreshToken, {
        secure: config_1.default.NODE_ENV === 'production',
        httpOnly: true,
    });
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Registration completed successfully',
        data: {
            user: result === null || result === void 0 ? void 0 : result.user,
            token: result === null || result === void 0 ? void 0 : result.accessToken,
        },
    });
    // Save ID for audit
    res.locals.createdResource = result === null || result === void 0 ? void 0 : result.user;
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield userRegistration_service_1.UserServices.getAllUserFromDB();
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'User Information Retrieved Successfully',
        data: result,
    });
    // Save ID for audit
    res.locals.createdResource = result;
}));
const getSingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield userRegistration_service_1.UserServices.getSingleUserFromDB(id);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'User Information Retrieved Successfully',
        data: result,
    });
    // Save ID for audit
    res.locals.createdResource = result;
}));
const updateUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield userRegistration_service_1.UserServices.updateUserFromDB(id, req.body);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'User updated successfully',
        data: result,
    });
    // Save ID for audit
    res.locals.createdResource = result;
}));
const getMe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const result = yield userRegistration_service_1.UserServices.getMeFromDB(email);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: `Your Information Retrieved Successfully`,
        data: result,
    });
    // Save ID for audit
    res.locals.createdResource = result;
}));
exports.userControllers = {
    createUsers,
    getSingleUser,
    getAllUsers,
    updateUsers,
    getMe,
};
