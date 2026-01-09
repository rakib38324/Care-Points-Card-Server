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
exports.AuditControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const commonResponse_1 = __importDefault(require("../../utils/commonResponse"));
const auditLogs_service_1 = require("./auditLogs.service");
const getAllAudits = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Pass req.query to the service for QueryBuilder processing
    const result = yield auditLogs_service_1.AuditServices.getAllAuditLogsFromDB(req.query);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Audit logs retrieved successfully',
        meta: result.meta, // Includes pagination info: page, limit, total, totalPage
        data: result.result,
    });
    // Note: We usually don't audit the "Audit Log" access itself
    // to prevent infinite loops, but you can if needed:
    res.locals.createdResource = result.result;
}));
const getSingleAudit = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield auditLogs_service_1.AuditServices.getSingleAuditLogFromDB(id);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Audit log fetched successfully',
        data: result,
    });
    res.locals.createdResource = result;
}));
exports.AuditControllers = {
    getAllAudits,
    getSingleAudit,
};
