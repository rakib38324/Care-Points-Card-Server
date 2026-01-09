"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const user_constent_1 = require("../UsersRegistration/user.constent");
const auditLogs_controller_1 = require("./auditLogs.controller");
const router = express_1.default.Router();
// Get all audit logs with search, filter, and pagination
router.get('/', (0, Auth_1.default)(user_constent_1.USER_ROLE.admin, user_constent_1.USER_ROLE.superAdmin), // Restricted to Admin and Super Admin
auditLogs_controller_1.AuditControllers.getAllAudits);
// Get a single audit log detail by ID
router.get('/:id', (0, Auth_1.default)(user_constent_1.USER_ROLE.admin, user_constent_1.USER_ROLE.superAdmin), auditLogs_controller_1.AuditControllers.getSingleAudit);
exports.AuditRoutes = router;
