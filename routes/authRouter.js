import express from "express";

import authenticate from "../middlewares/authenticate.js";

import authControllers from "../controllers/authControllers.js";

import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register",  authControllers.signupController);

authRouter.post("/login", authControllers.signinController);

authRouter.get("/current", authenticate, authControllers.getCurrentController);

authRouter.post("/logout", authenticate, authControllers.logoutController);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), authControllers.updateAvatarController);

export default authRouter;