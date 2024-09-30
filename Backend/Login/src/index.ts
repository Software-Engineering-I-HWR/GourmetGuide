import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { login } from "./authcontroller";
import { addUser } from "./database";

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// mock user
addUser("test34567@example.com", "password123");


// Routes
app.post("/login", login);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
