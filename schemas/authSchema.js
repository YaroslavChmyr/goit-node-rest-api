import Joi from "joi";

import { emailRegexp } from "../constants/auth.js";

export const authSignupSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string().valid("starter", "pro", "business").default("starter"),
    token: Joi.string().default(null),
})

export const authSigninSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
    token: Joi.string().default(null),
})