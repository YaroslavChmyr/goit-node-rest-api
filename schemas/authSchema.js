import Joi from "joi";

import { emailRegexp } from "../constants/auth.js";

export const authSignupSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string().valid("starter", "pro", "business").default("starter"),
})

export const authSigninSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

export const authVerifySchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
})