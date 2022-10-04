const Joi = require('joi');

const PostNotePayloadSchema = Joi.object({
  title: Joi.string().max(100),
  content: Joi.string(),
});

module.exports = { PostNotePayloadSchema };
