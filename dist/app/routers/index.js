"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = require("../models/Auth/auth.router");
const userRegistration_router_1 = require("../models/UsersRegistration/userRegistration.router");
const contact_router_1 = require("../models/Contact/contact.router");
const memberApplications_router_1 = require("../models/memberApplications/memberApplications.router");
const user_constent_1 = require("../models/UsersRegistration/user.constent");
const sponsorApplications_router_1 = require("../models/sponsorApplications/sponsorApplications.router");
const router = (0, express_1.Router)();
const moduleRouters = [
    {
        path: '/user',
        route: userRegistration_router_1.userRouter,
    },
    {
        path: '/auth',
        route: auth_router_1.loginRouters,
    },
    {
        path: '/contact',
        route: contact_router_1.contactRouter,
    },
    {
        path: `/${user_constent_1.USER_ROLE.member}`,
        route: memberApplications_router_1.memberRouters,
    },
    {
        path: `/${user_constent_1.USER_ROLE.sponsor}`,
        route: sponsorApplications_router_1.spondorRouters,
    },
];
moduleRouters.forEach((route) => router.use(route.path, route.route));
exports.default = router;
