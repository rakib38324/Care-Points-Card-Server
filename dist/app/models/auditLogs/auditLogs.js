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
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogger = void 0;
const auditLogs_model_1 = require("./auditLogs.model");
const encryption_utils_1 = require("../../utils/encryption.utils");
const auditLogger = (_a) => __awaiter(void 0, [_a], void 0, function* ({ req, res, action, resource, resourceId, statusCode, onModel, }) {
    try {
        const actingUser = req.user || res.locals.createdResource;
        yield auditLogs_model_1.AuditLog.create({
            actorId: (actingUser === null || actingUser === void 0 ? void 0 : actingUser._id) || null, // Captures 'Who'
            actorRole: (actingUser === null || actingUser === void 0 ? void 0 : actingUser.role) || 'GUEST',
            action, // Captures 'What'
            resource,
            resourceId: resourceId,
            onModel,
            endpoint: req.originalUrl,
            method: req.method,
            status: statusCode < 400 ? 'SUCCESS' : 'FAILURE',
            statusCode,
            // Compliance: Hash IP to protect privacy while maintaining auditability
            ipHash: (req === null || req === void 0 ? void 0 : req.ip)
                ? (0, encryption_utils_1.encrypt)((req === null || req === void 0 ? void 0 : req.ip) || req.connection.remoteAddress || '')
                : undefined,
            userAgent: req.headers['user-agent'],
        });
    }
    catch (err) {
        console.error('Audit database write failed:', err);
    }
});
exports.auditLogger = auditLogger;
