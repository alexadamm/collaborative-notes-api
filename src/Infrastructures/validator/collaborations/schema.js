const Joi = require('joi');

const CollaborationPayloadSchema = Joi.object({
  username: Joi.string().required(),
});

const CollaborationParamsSchema = Joi.object({
  noteId: Joi.string().uuid().required(),
});

module.exports = { CollaborationParamsSchema, CollaborationPayloadSchema };
