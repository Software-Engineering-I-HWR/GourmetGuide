import {Request, Response} from "express";
import {addUser, findUserByEmail} from "./database";
import jwt from 'jsonwebtoken';
import {jwtDecode} from "jwt-decode";
import {jwtsecret} from "../../../config/jwt-secret.json";
import {unlocked_users} from '../../../config/unlocked-users.json';
import crypto from "crypto";

const express = require('express');
const app = express();
const cors = require('cors');
const {encryption_key} = require('../../../config/encryption-secret.json');

app.use(cors());

const JWT_SECRET = jwtsecret;
const algorithm = 'aes-256-cbc';
const ivLength = 16;

const encryptPassword = (password: string): string => {
    if (!encryption_key || encryption_key.length !== 32) {
        throw new Error('Encryption key must be 32 characters long');
    }

    const iv = crypto.createHash('sha256').update(password).digest().slice(0, ivLength);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryption_key), iv);

    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
};

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(401).json({message: "Ungültige Anmeldedaten"});
    }

    const encryptedPassword = encryptPassword(password);
    const isPasswordValid = encryptedPassword === user.password;
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

export const adminCheck = async (req: Request, res: Response) => {
    const {token} = req.body;

    try {
        const decoded: any = jwtDecode(token);

        const isAuthorized = unlocked_users.some(
            (user) => user.username === decoded.email
        );

        if (isAuthorized) {
            return res.status(200).json({ message: 'Authorized' });
        } else {
            return res.status(403).json({ message: 'Not authorized' });
        }
    } catch (error) {
        console.error('Fehler beim Decodieren des Tokens:', error);
        return res.status(400).json({ message: 'Invalid token' });
    }
};