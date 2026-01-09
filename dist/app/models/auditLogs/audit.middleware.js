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
exports.auditMiddleware = void 0;
const auditLogs_1 = require("./auditLogs");
const user_constent_1 = require("../UsersRegistration/user.constent");
// ----------------- Audit Middleware -----------------
const auditMiddleware = (req, res, next) => {
    res.on('finish', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const resourceIds = getResourceId(req, res); // <-- use helper
            yield (0, auditLogs_1.auditLogger)({
                req,
                res,
                action: mapAction(req),
                resource: extractResource(req),
                resourceId: resourceIds,
                statusCode: res.statusCode,
            });
        }
        catch (err) {
            console.error('Audit Middleware Error:', err);
        }
    }));
    next();
};
exports.auditMiddleware = auditMiddleware;
const mapAction = (req) => {
    const url = req.originalUrl;
    if (url.includes('/login'))
        return 'USER_LOGIN';
    if (url.includes('/user-registration'))
        return 'USER_REGISTER';
    const methodMap = {
        POST: 'CREATE',
        PUT: 'UPDATE',
        PATCH: 'UPDATE',
        DELETE: 'DELETE',
        GET: 'READ',
    };
    return methodMap[req.method] || 'API_ACCESS';
};
// ----------------- Helper Functions -----------------
const getResourceId = (req, res) => {
    var _a, _b;
    // 1 Check URL param
    if ((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)
        return [req.params.id]; // wrap in array
    // 2 Check body for single or multiple IDs
    if (req.body) {
        if (Array.isArray(req.body)) {
            // body is array of objects
            const ids = req.body.map((item) => item._id || item.id).filter(Boolean);
            if (ids.length > 0)
                return ids;
        }
        else {
            // single object
            if (req.body._id)
                return [req.body._id];
            if (req.body.id)
                return [req.body.id];
        }
    }
    // 3️ Check res.locals for created resource(s)
    if ((_b = res === null || res === void 0 ? void 0 : res.locals) === null || _b === void 0 ? void 0 : _b.createdResource) {
        const created = res.locals.createdResource;
        if (Array.isArray(created)) {
            const ids = created.map((item) => item._id).filter(Boolean);
            if (ids.length > 0)
                return ids;
        }
        else if (created._id) {
            return [created._id];
        }
    }
    // 4️ fallback
    return [];
};
const extractResource = (req) => {
    const url = req.originalUrl;
    for (const role of Object.values(user_constent_1.USER_ROLE)) {
        if (url.includes(`/${role}/`))
            return `${role.toUpperCase()}_COLLECTION_ACCESS`;
    }
};
