"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
const mongoose_1 = require("mongoose");
const auditLogSchema = new mongoose_1.Schema({
    actorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    actorRole: { type: String },
    action: { type: String, required: true },
    resource: { type: String },
    resourceId: { type: [mongoose_1.Schema.Types.ObjectId], default: undefined },
    method: { type: String, required: true },
    endpoint: { type: String, required: true },
    status: { type: String, enum: ['SUCCESS', 'FAILURE'], required: true },
    statusCode: { type: Number, required: true },
    ipHash: { type: String },
    userAgent: { type: String },
}, {
    timestamps: { createdAt: true, updatedAt: false },
});
exports.AuditLog = (0, mongoose_1.model)('AuditLog', auditLogSchema);
