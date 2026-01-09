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
exports.SpondorControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const commonResponse_1 = __importDefault(require("../../utils/commonResponse"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sponsorApplications_service_1 = require("./sponsorApplications.service");
const createSpondorApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield sponsorApplications_service_1.SponsorApplicationServices.createSponsorIntoDB(req.user, req.body);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Sponsor Application Send Successfully.',
        data: result,
    });
}));
const getSingleSposorApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield sponsorApplications_service_1.SponsorApplicationServices.getSingleSponsorApplicationFromDB(req.user);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Sponsor Application Retrieved Successfully.',
        data: result,
    });
}));
const getAllSponsorApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield sponsorApplications_service_1.SponsorApplicationServices.getAllSponsorApplicationsFromDB(req.user);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Sponsor Application Retrieved Successfully.',
        data: result,
    });
}));
const updateSponsorApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield sponsorApplications_service_1.SponsorApplicationServices.updateSponsorApplicationFromDB(req.user, id, req.body);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Spondor Application Retrieved Successfully.',
        data: result,
    });
}));
const deleteSponsorApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield sponsorApplications_service_1.SponsorApplicationServices.deleteSponsorApplicationFromDB(req.user, id);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Spondor Application Delete Successfully.',
        data: result,
    });
}));
const getSponsorApplicationsWithEmail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const result = yield sponsorApplications_service_1.SponsorApplicationServices.getSponsorApplicationWithEmailFromDB(email);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Spondor Application Retrieved Successfully.',
        data: result,
    });
}));
exports.SpondorControllers = {
    createSpondorApplication,
    getAllSponsorApplication,
    getSingleSposorApplication,
    getSponsorApplicationsWithEmail,
    updateSponsorApplication,
    deleteSponsorApplication,
};
