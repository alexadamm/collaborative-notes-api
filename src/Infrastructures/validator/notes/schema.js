const Joi = require('joi');

const PostNotePayloadSchema = Joi.object({
  title: Joi.string().max(100),
  content: Joi.string(),
});

const GetNoteByIdParamsSchema = Joi.object({
  noteId: Joi.string().uuid().required(),
});

module.exports = { PostNotePayloadSchema, GetNoteByIdParamsSchema };
