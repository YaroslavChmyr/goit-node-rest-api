import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(5).required(),
  favorite: Joi.boolean(),
})

export const updateContactSchema = Joi.object({
  name: Joi.string().min(1),
  email: Joi.string().email(),
  phone: Joi.string().min(5),
  favorite: Joi.boolean(),
}).or("name", "email", "phone", "favorite");

export const updateStatusContactSchema = Joi.object({
  favorite: Joi.boolean().required(),
}).required();