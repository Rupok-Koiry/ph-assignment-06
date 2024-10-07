"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const errorHandler_1 = __importDefault(require("./app/middlewares/errorHandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Middleware for parsing JSON bodies
app.use(express_1.default.json());
// Middleware for parsing cookies
app.use((0, cookie_parser_1.default)());
// Set the template engine to EJS
app.set('view engine', 'ejs');
// eslint-disable-next-line no-undef
app.set('views', path_1.default.join(__dirname, 'views'));
// Middleware for enabling Cross-Origin Resource Sharing (CORS) for specified origins
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'https://ph-assignment-06-client.vercel.app',
    ],
}));
// Route handlers for API endpoints prefixed with /api/v1
app.use('/api', routes_1.default);
// Middleware for handling global errors
app.use(errorHandler_1.default);
// Middleware for handling 404 - Not Found errors
app.use(notFound_1.default);
exports.default = app;
