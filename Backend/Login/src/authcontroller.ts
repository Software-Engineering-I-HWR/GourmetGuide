import { Request, Response } from "express";
import {addUser, findUserByEmail} from "./database";
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

// Login controller
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Ungültige Anmeldedaten" });
  }

  // Compare passwords
  const isPasswordValid = password == user.password;
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Ungültige Anmeldedaten" });
  }

  res.send({
    token: 'test123'
  });
  return res.status(200).json({ message: "Login erfolgreich" });
};

// Register controller
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const success = await addUser(email, password);

  return res.status(success).json({ message: "Registrierung" });
}