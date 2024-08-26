const Joi = require('joi');

const CreateTaskSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': `Name field is required`
  }),
  priority: Joi.string().valid('high', 'medium', 'low'),
  status: Joi.string().valid('To Do', 'In Progress', 'In Review', 'Completed')
});

module.exports = CreateTaskSchema;