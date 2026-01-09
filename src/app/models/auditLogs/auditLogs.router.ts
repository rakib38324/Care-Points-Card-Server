import express from 'express';
import Auth from '../../middlewares/Auth';
import { USER_ROLE } from '../UsersRegistration/user.constent';
import { AuditControllers } from './auditLogs.controller';

const router = express.Router();

// Get all audit logs with search, filter, and pagination
router.get(
  '/',
  Auth(USER_ROLE.admin, USER_ROLE.superAdmin), // Restricted to Admin and Super Admin
  AuditControllers.getAllAudits,
);

// Get a single audit log detail by ID
router.get(
  '/:id',
  Auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  AuditControllers.getSingleAudit,
);

export const AuditRoutes = router;
