import Joi from "joi";

export const editProfileSchema = Joi.object({
  name: Joi.object({
    first: Joi.string().min(2).max(256).required().messages({
      "string.empty": "First name is required",
      "string.min": "First name must be at least 2 characters",
      "string.max": "First name must be less than 256 characters",
      "any.required": "First name is required",
    }),

    middle: Joi.string().min(2).max(256).allow("").messages({
      "string.min": "Middle name must be at least 2 characters",
      "string.max": "Middle name must be less than 256 characters",
    }),

    last: Joi.string().min(2).max(256).required().messages({
      "string.empty": "Last name is required",
      "string.min": "Last name must be at least 2 characters",
      "string.max": "Last name must be less than 256 characters",
      "any.required": "Last name is required",
    }),
  }).unknown(true),

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
  }).unknown(true),

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
    zip: Joi.number().required().messages({
      "number.base": "Zip code must be a number",
      "any.required": "Zip is required",
    }),
  }).unknown(true),

  isBusiness: Joi.boolean(),
  isAdmin: Joi.boolean().allow("", null),
}).unknown(true); 
