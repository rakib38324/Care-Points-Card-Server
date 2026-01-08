import express from 'express';
import ValidateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../UsersRegistration/user.constent';
import Auth from '../../middlewares/Auth';
import { SponsorApplicationValidations } from './sponsorApplications.validation';
import { SpondorControllers } from './sponsorApplications.controller';

const router = express.Router();

router.post(
  `/application`,
  Auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.doctor,
    USER_ROLE.employer,
    USER_ROLE.member,
    USER_ROLE.ngo,
    USER_ROLE.provider,
    USER_ROLE.sponsor,
  ),
  ValidateRequest(SponsorApplicationValidations.createSponsorValidationSchema),
  SpondorControllers.createSpondorApplication,
);

router.get(
  `/application`,
  Auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.doctor,
    USER_ROLE.employer,
    USER_ROLE.member,
    USER_ROLE.ngo,
    USER_ROLE.provider,
    USER_ROLE.sponsor,
  ),
  SpondorControllers.getSingleSposorApplication,
);

router.patch(
  `/:id`,
  Auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.doctor,
    USER_ROLE.employer,
    USER_ROLE.member,
    USER_ROLE.ngo,
    USER_ROLE.provider,
    USER_ROLE.sponsor,
  ),
  ValidateRequest(SponsorApplicationValidations?.updateSponsorValidationSchema),
  SpondorControllers.updateSponsorApplication,
);

router.get(
  `/all-application`,
  Auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  SpondorControllers.getAllSponsorApplication,
);

router.get(
  `/:email`,
  Auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  SpondorControllers.getSponsorApplicationsWithEmail,
);

router.delete(
  `/:id`,
  Auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  SpondorControllers.deleteSponsorApplication,
);

export const spondorRouters = router;
