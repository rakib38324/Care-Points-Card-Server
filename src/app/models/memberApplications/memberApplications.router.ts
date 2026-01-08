import express from 'express';
import ValidateRequest from '../../middlewares/validateRequest';
import { MemberApplicationValidations } from './memberApplications.validation';
import { USER_ROLE } from '../UsersRegistration/user.constent';
import { memberControllers } from './memberApplications.controller';
import Auth from '../../middlewares/Auth';

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
  ValidateRequest(
    MemberApplicationValidations.createMemberApplicationValidationSchema,
  ),
  memberControllers.createMembersApplication,
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
  memberControllers.getSingleMemberApplication,
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
  ValidateRequest(
    MemberApplicationValidations?.updateMemberApplicationValidationSchema,
  ),
  memberControllers.updateMemberApplication,
);

router.get(
  `/all-application`,
  Auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  memberControllers.getAllMemberApplication,
);

router.get(
  `/:email`,
  Auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  memberControllers.getMemberApplicationsWithEmail,
);

router.delete(
  `/:id`,
  Auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  memberControllers.deleteMemberApplication,
);

export const memberRouters = router;
