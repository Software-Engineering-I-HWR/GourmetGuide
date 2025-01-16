import {Request, Response} from "express";
import {addUser, findUserByEmail} from "./database";
import jwt from 'jsonwebtoken';

const express = require('express');
const app = express();
const cors = require('cors');
const {jwtsecret} = require('../../../config/jwt-secret.json');


app.use(cors());

const JWT_SECRET = jwtsecret;
export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(401).json({message: "Ungültige Anmeldedaten"});
    }

    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
        return res.status(401).json({message: "Ungültige Anmeldedaten"});
    }

    // Generate JWT token with email (username) as the unique identifier
    const token = jwt.sign({email: user.email}, JWT_SECRET, {
        expiresIn: "1h"
    });

    return res.status(200).json({
        message: "Login erfolgreich",
        token
    });
};

export const register = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const success = await addUser(email, password);

    return res.status(success).json({message: "Registrierung erfolgreich"});
};
