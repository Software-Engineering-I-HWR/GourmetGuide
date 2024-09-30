"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const database_1 = require("./database");
// Login controller
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Find the user by email
    const user = yield (0, database_1.findUserByEmail)(email);
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    // Compare passwords
    const isPasswordValid = password == user.password;
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    // Set cookie if authentication is successful
    res.cookie("authToken", "SECURE_TOKEN_WHICH_IS_VERY_SECURE_TRUST_ME_BRO_" + email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    return res.status(200).json({ message: "Login successful" });
});
exports.login = login;
