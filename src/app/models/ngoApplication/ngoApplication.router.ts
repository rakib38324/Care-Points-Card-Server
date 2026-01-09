import express from 'express';
import Auth from '../../middlewares/Auth';
import ValidateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../UsersRegistration/user.constent';
import { ngoApplicationControllers } from './ngoApplication.controller';
// Ensure you create this validation file next
import { NGOApplicationValidations } from './ngoApplication.validation';

const router = express.Router();

/**
 * Create a new NGO Application
 * Accessible by all roles, but typically restricted to NGO or Admins in logic
 */
router.post(
  '/application',
  Auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.ngo,
    USER_ROLE.employer,
    USER_ROLE.sponsor,
  ),
  ValidateRequest(
    NGOApplicationValidations.createNGOApplicationValidationSchema,
  ),
  ngoApplicationControllers.createNGOApplication,
);

/**
 * Get the application for the logged-in user
 */
router.get(
  '/application',
  Auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.ngo),
  ngoApplicationControllers.getSingleNGOApplication,
);

/**
 * Update an existing NGO application by ID
 */
router.patch(
  '/:id',
  Auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.ngo),
  ValidateRequest(
    NGOApplicationValidations.updateNGOApplicationValidationSchema,
  ),
  ngoApplicationControllers.updateNGOApplication,
);

/**
 * Get all NGO applications
 * Restricted to Admin and Super Admin
 */
router.get(
  '/all-application',
  Auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  ngoApplicationControllers.getAllNGOApplications,
);

/**
 * Get NGO applications with email
 * Restricted to Admin and Super Admin
 */
router.get(
  '/:email',
  Auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  ngoApplicationControllers.getNGOApplicationsWithEmail,
);

/**
 * Delete (Soft Delete) an NGO application
 * Restricted to Admin and Super Admin
 */
router.delete(
  '/:id',
  Auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  ngoApplicationControllers.deleteNGOApplication,
);

export const ngoApplicationRoutes = router;
