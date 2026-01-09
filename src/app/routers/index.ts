import { Router } from 'express';
import { loginRouters } from '../models/Auth/auth.router';
import { userRouter } from '../models/UsersRegistration/userRegistration.router';
import { contactRouter } from '../models/Contact/contact.router';
import { memberRouters } from '../models/memberApplications/memberApplications.router';
import { USER_ROLE } from '../models/UsersRegistration/user.constent';
import { spondorRouters } from '../models/sponsorApplications/sponsorApplications.router';
import { ngoApplicationRoutes } from '../models/ngoApplication/ngoApplication.router';

const router = Router();

const moduleRouters = [
  {
    path: '/user',
    route: userRouter,
  },
  {
    path: '/auth',
    route: loginRouters,
  },
  {
    path: '/contact',
    route: contactRouter,
  },
  {
    path: `/${USER_ROLE.member}`,
    route: memberRouters,
  },
  {
    path: `/${USER_ROLE.sponsor}`,
    route: spondorRouters,
  },
  {
    path: `/${USER_ROLE.ngo}`,
    route: ngoApplicationRoutes,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));
export default router;
