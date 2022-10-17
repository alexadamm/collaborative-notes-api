const Joi = require('joi');

const NotePayloadSchema = Joi.object({
  title: Joi.string().max(100),
  content: Joi.string(),
});

const NoteByIdParamsSchema = Joi.object({
  noteId: Joi.string().uuid().required(),
});

module.exports = { NotePayloadSchema, NoteByIdParamsSchema };
