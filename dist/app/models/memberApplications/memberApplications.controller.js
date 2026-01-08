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
exports.memberControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const commonResponse_1 = __importDefault(require("../../utils/commonResponse"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const memberApplications_service_1 = require("./memberApplications.service");
const createMembersApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield memberApplications_service_1.memberServices.createMemberIntoDB(req.user, req.body);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Member Application Send Successfully.',
        data: result,
    });
}));
const getSingleMemberApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield memberApplications_service_1.memberServices.getSingleMemberApplicationFromDB(req.user);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Member Application Retrieved Successfully.',
        data: result,
    });
}));
const getAllMemberApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield memberApplications_service_1.memberServices.getAllMemberApplicationFromDB(req.user);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Member Application Retrieved Successfully.',
        data: result,
    });
}));
const updateMemberApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield memberApplications_service_1.memberServices.updateMemberApplicationFromDB(req.user, id, req.body);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Member Application Retrieved Successfully.',
        data: result,
    });
}));
const deleteMemberApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield memberApplications_service_1.memberServices.deleteMemberApplicationFromDB(req.user, id);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Member Application Delete Successfully.',
        data: result,
    });
}));
const getMemberApplicationsWithEmail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const result = yield memberApplications_service_1.memberServices.getMemberApplicationWithEmailFromDB(email);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Member Application Retrieved Successfully.',
        data: result,
    });
}));
exports.memberControllers = {
    createMembersApplication,
    getAllMemberApplication,
    getSingleMemberApplication,
    deleteMemberApplication,
    getMemberApplicationsWithEmail,
    updateMemberApplication
};
