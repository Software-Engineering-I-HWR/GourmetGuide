import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import {login, register} from "./authcontroller";
import { addUser } from "./database";

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.post("/login", login);
app.post("/register", register);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
