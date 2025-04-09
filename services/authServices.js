import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../db/models/User.js";

import HttpError from "../helpers/HttpError.js";

export const signupUser = async data => {
  const {email, password} = data;
  const user = await User.findOne({
      where: {
          email
      }
  });

  if(user) {
      throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  return User.create({...data, password: hashPassword});
}