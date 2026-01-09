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
exports.AuditServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importDefault(require("mongoose"));
const appError_1 = __importDefault(require("../../errors/appError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const auditLogs_model_1 = require("./auditLogs.model");
const encryption_utils_1 = require("../../utils/encryption.utils");
const employerApplication_decrytor_1 = require("../employerApplication/employerApplication.decrytor");
const memberApplications_decryptor_1 = require("../memberApplications/memberApplications.decryptor");
const ngoApplication_decryptor_1 = require("../ngoApplication/ngoApplication.decryptor");
const sponsorApplications_decryptor_1 = require("../sponsorApplications/sponsorApplications.decryptor");
// Only models with encrypted payloads
const modelDecryptors = {
    EmployerApplication: employerApplication_decrytor_1.decryptEmployerApplicationPayload,
    MemberApplications: memberApplications_decryptor_1.decryptMemberApplicationPayload,
    NGOApplication: ngoApplication_decryptor_1.decryptNGOApplicationPayload,
    SponsorApplications: sponsorApplications_decryptor_1.decryptSponsorPayload,
};
const getAllAuditLogsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const auditSearchableFields = ['action', 'resource', 'actorRole'];
    const auditQuery = new QueryBuilder_1.default(auditLogs_model_1.AuditLog.find().populate({
        path: 'actorId',
        select: '-password -passwordChangedAt -__v',
    }), query)
        .search(auditSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const rawResult = yield auditQuery.modelQuery.lean();
    const meta = yield auditQuery.countTotal();
    const result = yield Promise.all(rawResult.map((log) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (log.onModel && ((_a = log.resourceId) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            try {
                const TargetModel = mongoose_1.default.model(log.onModel);
                let resourceData = yield TargetModel.find({
                    _id: { $in: log.resourceId },
                })
                    .select('-password -passwordChangedAt -__v')
                    .lean();
                // Apply decryption if function exists for the model
                const decryptFn = modelDecryptors[log.onModel];
                if (decryptFn) {
                    resourceData = resourceData.map(decryptFn);
                }
                log.resourceData = resourceData;
                delete log.resourceId;
            }
            catch (err) {
                // console.error(`Dynamic Population failed for model [${log.onModel}]:`, err);
                log.resourceData = [];
            }
        }
        if (log.ipHash && log.ipHash.includes(':')) {
            try {
                log.ip = (0, encryption_utils_1.decrypt)(log.ipHash);
                delete log.ipHash;
            }
            catch (e) {
                log.ip = 'Decryption Error';
            }
        }
        return log;
    })));
    return { meta, result };
});
const getSingleAuditLogFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = yield auditLogs_model_1.AuditLog.findById(id)
        .populate({
        path: 'actorId',
        select: '-password -__v',
    })
        .lean();
    if (!result) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Audit log not found');
    }
    const logObj = result;
    // Dynamic population for single record
    if (logObj.onModel && ((_a = logObj.resourceId) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        try {
            const TargetModel = mongoose_1.default.model(logObj.onModel);
            let resourceData = yield TargetModel.find({
                _id: { $in: logObj.resourceId },
            })
                .select('-password -passwordChangedAt -__v')
                .lean();
            // Apply model-specific decryption if exists
            const decryptFn = modelDecryptors[logObj.onModel];
            if (decryptFn) {
                resourceData = resourceData.map(decryptFn);
            }
            logObj.resourceData = resourceData;
            delete logObj.resourceId;
        }
        catch (err) {
            // console.error(`Dynamic Population failed for model [${logObj.onModel}]:`, err);
            logObj.resourceData = [];
        }
    }
    // Decrypt IP if needed
    if ((_b = logObj.ipHash) === null || _b === void 0 ? void 0 : _b.includes(':')) {
        try {
            logObj.ip = (0, encryption_utils_1.decrypt)(logObj.ipHash);
            delete logObj.ipHash;
        }
        catch (_c) {
            logObj.ip = 'Decryption Error';
        }
    }
    return logObj;
});
exports.AuditServices = { getAllAuditLogsFromDB, getSingleAuditLogFromDB };
