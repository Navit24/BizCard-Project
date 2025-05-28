
import Joi from "joi";

export const editProfileSchema = Joi.object({
  name: Joi.object().keys({
    first: Joi.string().min(2).max(256).required(),
    middle: Joi.string().min(0).max(256).allow(""),
    last: Joi.string().min(2).max(256).required(),
  }),
  phone: Joi.string()
    .pattern(/0[0-9]{1,2}-?\s?[0-9]{3}\s?[0-9]{4}/)
    .message("Phone must be valid")
    .required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  image: Joi.object().keys({
    url: Joi.string()
      .pattern(/(https?:\/\/(?:www\.|(?!www))[^\s]+\.[^\s]{2,})/)
      .message("Image URL must be valid")
      .allow(""),
    alt: Joi.string().min(0).max(256).allow(""),
  }),
  address: Joi.object().keys({
    state: Joi.string().allow(""),
    country: Joi.string().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
    houseNumber: Joi.number().required(),
    zip: Joi.number().allow(null, ""),
  }),
  isBusiness: Joi.boolean().required(),
  isAdmin: Joi.boolean().allow("", null),
});
