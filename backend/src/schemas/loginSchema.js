const Joi = require('joi');

const LoginSchema = Joi.object({
    email: Joi.string().required().messages({
        'any.required': `Email field is required`
      }),
    password: Joi.string().required().messages({
        'any.required': `Password field is required`
    }),
})

module.exports = LoginSchema;