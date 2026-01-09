"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ngoApplicationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constent_1 = require("../UsersRegistration/user.constent");
const ngoApplication_controller_1 = require("./ngoApplication.controller");
// Ensure you create this validation file next
const ngoApplication_validation_1 = require("./ngoApplication.validation");
const router = express_1.default.Router();
/**
 * Create a new NGO Application
 * Accessible by all roles, but typically restricted to NGO or Admins in logic
 */
router.post('/application', (0, Auth_1.default)(user_constent_1.USER_ROLE.admin, user_constent_1.USER_ROLE.superAdmin, user_constent_1.USER_ROLE.ngo, user_constent_1.USER_ROLE.employer, user_constent_1.USER_ROLE.sponsor), (0, validateRequest_1.default)(ngoApplication_validation_1.NGOApplicationValidations.createNGOApplicationValidationSchema), ngoApplication_controller_1.ngoApplicationControllers.createNGOApplication);
/**
 * Get the application for the logged-in user
 */
router.get('/application', (0, Auth_1.default)(user_constent_1.USER_ROLE.admin, user_constent_1.USER_ROLE.superAdmin, user_constent_1.USER_ROLE.ngo), ngoApplication_controller_1.ngoApplicationControllers.getSingleNGOApplication);
/**
 * Update an existing NGO application by ID
 */
router.patch('/:id', (0, Auth_1.default)(user_constent_1.USER_ROLE.admin, user_constent_1.USER_ROLE.superAdmin, user_constent_1.USER_ROLE.ngo), (0, validateRequest_1.default)(ngoApplication_validation_1.NGOApplicationValidations.updateNGOApplicationValidationSchema), ngoApplication_controller_1.ngoApplicationControllers.updateNGOApplication);
/**
 * Get all NGO applications
 * Restricted to Admin and Super Admin
 */
router.get('/all-application', (0, Auth_1.default)(user_constent_1.USER_ROLE.admin, user_constent_1.USER_ROLE.superAdmin), ngoApplication_controller_1.ngoApplicationControllers.getAllNGOApplications);
/**
 * Get NGO applications with email
 * Restricted to Admin and Super Admin
 */
router.get('/:email', (0, Auth_1.default)(user_constent_1.USER_ROLE.admin, user_constent_1.USER_ROLE.superAdmin), ngoApplication_controller_1.ngoApplicationControllers.getNGOApplicationsWithEmail);
/**
 * Delete (Soft Delete) an NGO application
 * Restricted to Admin and Super Admin
 */
router.delete('/:id', (0, Auth_1.default)(user_constent_1.USER_ROLE.admin, user_constent_1.USER_ROLE.superAdmin), ngoApplication_controller_1.ngoApplicationControllers.deleteNGOApplication);
exports.ngoApplicationRoutes = router;
