import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import {login, register} from "./authcontroller";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.post("/login", login);
app.post("/register", register);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});