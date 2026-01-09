"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routers_1 = __importDefault(require("./app/routers"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const audit_middleware_1 = require("./app/middlewares/audit.middleware");
const app = (0, express_1.default)();
//--->parser
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
// app.use(
//   cors({
//     origin: ['https://cmd-new.blockshare.app', 'http://localhost:3000'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true, // Only if you're using cookies or auth headers
//   }),
// );
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(audit_middleware_1.auditMiddleware);
//==========>application routes
app.use('/api/v1', routers_1.default);
app.get('/', (req, res) => {
    res.send('Care Point Server Server is running successfully.');
});
//========> handle the router not found
app.use(notFound_1.default);
//--> global error
app.use(globalErrorHandler_1.default);
exports.default = app;
