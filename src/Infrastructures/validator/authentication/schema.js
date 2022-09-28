const Joi = require('joi');

const PostAuthenticationSchema = Joi.object({
  username: Joi.string().max(50).regex(/^[\w]+$/).required(),
  password: Joi.string().required(),
});

module.exports = { PostAuthenticationSchema };
