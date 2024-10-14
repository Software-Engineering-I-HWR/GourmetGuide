import { Request, Response } from "express";
import { addUser, findUserByEmail } from "./database";
import jwt from 'jsonwebtoken';

const express = require('express');
const app = express();
const cors = require('cors');
const {jwtsecret} = require('../config.json');


app.use(cors());

const JWT_SECRET = jwtsecret;
// Login controller
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Ungültige Anmeldedaten" });
  }

  // Compare passwords
  const isPasswordValid = password === user.password;  // In Produktion solltest du bcrypt zum Hashing und Vergleich nutzen
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Ungültige Anmeldedaten" });
  }

  // Generate JWT token with email as the unique identifier
  const token = jwt.sign({ email: user.email }, JWT_SECRET, {
    expiresIn: "1h" // Token läuft nach einer Stunde ab
  });

  return res.status(200).json({
    message: "Login erfolgreich",
    token
  });
};

// Register controller
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // In Produktion solltest du bcrypt zum Hashing des Passworts verwenden
  const success = await addUser(email, password);

  return res.status(success).json({ message: "Registrierung erfolgreich" });
};
