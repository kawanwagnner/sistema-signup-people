// routes.js
import express from "express";
import { signIn, signUp } from "../controllers/authController.mjs";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);

export default authRouter;
