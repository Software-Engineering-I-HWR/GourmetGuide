import { Request, Response } from "express";
import { findUserByEmail } from "./database";

// Login controller
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = findUserByEmail(email);
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
};
