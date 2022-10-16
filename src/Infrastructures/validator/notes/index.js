const ValidationErrorHandler = require('../../../Commons/exceptions/ValidationErrorHandler');
const { PostNotePayloadSchema, GetNoteByIdParamsSchema } = require('./schema');

const NotesValidator = {
  validatePostNotePayload: (payload) => {
    const validationResult = PostNotePayloadSchema.validate(payload);

    if (validationResult.error) {
      ValidationErrorHandler(validationResult);
    }
  },

  validateGetNoteByIdParams: (params) => {
    const validationResult = GetNoteByIdParamsSchema.validate(params);

    if (validationResult.error) {
      ValidationErrorHandler(validationResult);
    }
  },
};

module.exports = NotesValidator;
