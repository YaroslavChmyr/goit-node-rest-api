import express from "express";

import authControllers from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/register",  authControllers.signupController);

// authRouter.post("/signin", authControllers.signinController);

export default authRouter;