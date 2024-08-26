const Joi = require('joi');

const CreateTaskSchema = Joi.object({
  name: Joi.string(),
  priority: Joi.string().valid('high', 'medium', 'low'),
  status: Joi.string().valid('To Do', 'In Progress', 'In Review', 'Completed').messages({
    'any.required': `status field is required`
  })
});

module.exports = CreateTaskSchema;