import Joi from "joi"

export default function schema_login() {
  return Joi.object({
    email: Joi.string().email().required().messages({
      "string.base": "Email must be text",
      "string.email": "Does not conform to email format",
      "any.required": "The email field must not be empty",
    }),
    password: Joi.string()
      .min(8)
      .max(15)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
      .required()
      .messages({
        "string.base": "The password must be text",
        "string.min": "The password must consist of at least 8 characters",
        "string.max": "The password must contain a maximum of 15 characters",
        "string.pattern.base": "The password must contain uppercase, lowercase Latin letters and numbers",
        "any.required": "The password field must not be empty",
      }),
  })
}
