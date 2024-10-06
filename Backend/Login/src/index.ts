import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import https from "https";
import { login, register } from "./authcontroller";

// SSL-Zertifikate laden
const privateKey = fs.readFileSync('/usr/local/app/cert/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/usr/local/app/cert/cert.pem', 'utf8');
const ca = fs.readFileSync('/usr/local/app/cert/chain.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate, ca: ca };

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.post("/login", login);
app.post("/register", register);

// Start the HTTPS server
https.createServer(credentials, app).listen(port, () => {
  console.log(`HTTPS Server running at https://localhost:${port}`);
});