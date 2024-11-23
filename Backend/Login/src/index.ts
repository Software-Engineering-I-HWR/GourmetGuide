import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import https from "https";
import { login, register } from "./authcontroller";

const privateKey = fs.readFileSync('../../../config/cert/privkey.pem', 'utf8');
const certificate = fs.readFileSync('../../../config/cert/cert.pem', 'utf8');
const ca = fs.readFileSync('../../../config/cert/chain.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate, ca: ca };

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.post("/login", login);
app.post("/register", register);

https.createServer(credentials, app).listen(port, () => {
  console.log(`HTTPS Server running at https://localhost:${port}`);
});