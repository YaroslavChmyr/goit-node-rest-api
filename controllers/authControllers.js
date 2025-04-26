import * as authServices from "../services/authServices.js";
import { authSignupSchema, authSigninSchema, authVerifySchema } from "../schemas/authSchema.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import gravatar from "gravatar";
import fs from "node:fs/promises";
import path from "node:path";

const avatarsDir = path.resolve("public", "avatars");

const verifyController = async(req, res)=> {
  const {verificationCode} = req.params;
  await authServices.verifyUser(verificationCode);

  res.json({
      message: "Email verified successfully"
  })
}

const resendVerifyEmailController = async(req, res)=> {
  const { error } = authVerifySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const {email} = req.body;
  await authServices.resendVerifyEmail(email);

  res.json({
      message: "Verify email resend"
  })
}

const signupController = async (req, res) => {
  const { error } = authSignupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const { email } = req.body;
  const avatarURL = gravatar.url(email, { s: "250", d: "identicon" });
  const newUser = await authServices.signupUser({...req.body, avatarURL});

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const signinController = async(req, res)=> {
  const { error } = authSigninSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const {token} = await authServices.signinUser(req.body);

  res.json({
      token,
  });
}

const getCurrentController = (req, res)=> {
  const {email, subscription} = req.user;

  res.json({
      email,
      subscription,
  })
}

const logoutController = async(req, res)=> {
  const {id} = req.user;
  await authServices.logoutUser(id);

  res.json({
      message: "Logout successfully"
  })
}

const updateAvatarController = async (req, res) => {
  let poster = null;
  if(req.file) {
    const {path: oldPath, filename} = req.file;
    const newPath = path.join(avatarsDir, filename);
    await fs.rename(oldPath, newPath);
    poster = path.join("avatars", filename);
  }
  const { id } = req.user;
  const data = await authServices.updateAvatar({ ...req.body, avatarURL: poster, id });

  res.json({
    avatarURL: data.avatarURL,
  });
}

export default {
  signupController: ctrlWrapper(signupController),
  signinController: ctrlWrapper(signinController),
  getCurrentController: ctrlWrapper(getCurrentController),
  logoutController: ctrlWrapper(logoutController),
  updateAvatarController: ctrlWrapper(updateAvatarController),
  verifyController: ctrlWrapper(verifyController),
  resendVerifyEmailController: ctrlWrapper(resendVerifyEmailController),
};
