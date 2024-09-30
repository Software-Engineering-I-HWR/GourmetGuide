"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const authcontroller_1 = require("./authcontroller");
const database_1 = require("./database");
const app = (0, express_1.default)();
const port = 3000;
// Middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
// mock user
(0, database_1.addUser)("test@example.com", "password123");
// Routes
app.post("/login", authcontroller_1.login);
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
