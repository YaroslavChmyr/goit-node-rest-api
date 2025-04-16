import * as authServices from "../services/authServices.js";
import { authSignupSchema, authSigninSchema } from "../schemas/authSchema.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const signupController = async (req, res) => {
  const { error } = authSignupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const newUser = await authServices.signupUser(req.body);

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

export default {
  signupController: ctrlWrapper(signupController),
  signinController: ctrlWrapper(signinController),
  getCurrentController: ctrlWrapper(getCurrentController),
  logoutController: ctrlWrapper(logoutController),
};
