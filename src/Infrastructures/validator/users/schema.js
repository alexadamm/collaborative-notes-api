const Joi = require('joi');

const PostUserPayloadSchema = Joi.object({
  username: Joi.string().max(50).regex(/^[\w]+$/).required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

module.exports = { PostUserPayloadSchema };
