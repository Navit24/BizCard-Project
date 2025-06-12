import Joi from "joi";

export const cardSchema = Joi.object({
  title: Joi.string().min(2).max(256).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 2 characters",
    "string.max": "Title must be less than 256 characters",
    "any.required": "Title name is required",
  }),
  subtitle: Joi.string().min(2).max(256).required().messages({
    "string.empty": "Subtitle is required",
    "string.min": "Subtitle must be at least 2 characters",
    "string.max": "Subtitle must be less than 256 characters",
    "any.required": "Subtitle name is required",
  }),
  description: Joi.string().min(2).max(1024).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 2 characters",
    "string.max": "Description must be less than 256 characters",
    "any.required": "Description name is required",
  }),

  phone: Joi.string()
    .pattern(/0[0-9]{1,2}-?\s?[0-9]{3}\s?[0-9]{4}/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number is invalid",
      "any.required": "Phone number is required",
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),

  web: Joi.string().uri().allow(""),

  image: Joi.object({
    url: Joi.string()
      .pattern(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9-]+(\.[^\s]{2,})+)/)
      .allow("")
      .messages({
        "string.pattern.base": "Image URL must be valid",
      }),
    alt: Joi.string().min(2).max(256).allow("").messages({
      "string.min": "Image alt must be at least 2 characters",
      "string.max": "Image alt must be less than 256 characters",
    }),
  }),

  address: Joi.object({
    state: Joi.string().allow(""),

    country: Joi.string().required().messages({
      "string.empty": "Country is required",
      "any.required": "Country is required",
    }),
    city: Joi.string().required().messages({
      "string.empty": "City is required",
      "any.required": "City is required",
    }),
    street: Joi.string().required().messages({
      "string.empty": "Street is required",
      "any.required": "Street is required",
    }),
    houseNumber: Joi.number().required().messages({
      "number.base": "House number must be a number",
      "any.required": "House number is required",
    }),
    zip: Joi.number().allow("").messages({
      "number.base": "Zip code must be a number",
    }),
  }),
  bizNumber: Joi.number().optional(),
  likes: Joi.array().items(Joi.string()).optional(),
});
