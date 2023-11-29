import Joi from "joi"

export default function schema_refreshToken() {
  return Joi.object({
    token: Joi.string().required().messages({
      "string.base": "Token must be text",
      "any.required": "The token field must not be empty",
    }),
  })
}