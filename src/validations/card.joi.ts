import Joi from "joi";

export const cardSchema = Joi.object({
  title: Joi.string().min(2).max(256).required(),
  subtitle: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(1024).required(),

  phone: Joi.string()
    .pattern(/0[0-9]{1,2}-?\s?[0-9]{3}\s?[0-9]{4}/)
    .message("Phone must be valid")
    .required(),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),

  web: Joi.string().uri().allow(""),

  image: Joi.object({
    url: Joi.string()
      .pattern(/(https?:\/\/(?:www\.|(?!www))[^\s]+\.[^\s]{2,})/)
      .message("Image URL must be valid")
      .allow(""),
    alt: Joi.string().min(0).max(256).allow(""),
  }),

  address: Joi.object({
    state: Joi.string().allow(""),
    country: Joi.string().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
    houseNumber: Joi.number().required(),
    zip: Joi.number().allow(null, ""),
  }),

  bizNumber: Joi.number().optional(),
  likes: Joi.array().items(Joi.string()).optional(),
});
