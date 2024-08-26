const Joi = require('joi');

const CreateUserSchema = Joi.object({
    firstName: Joi.string().required().messages({
        'any.required': `First Name field is required`
    }),
    lastName: Joi.string().required().messages({
        'any.required': `Last Name field is required`
    }),
    email: Joi.string().required().messages({
        'any.required': `Email field is required`
      }),
    password: Joi.string().min(6).required().messages({
        'any.required': `Password field is required`,
        'string.min': `Password should have a minimum length of {#limit}`,
    }),
})

module.exports = CreateUserSchema;