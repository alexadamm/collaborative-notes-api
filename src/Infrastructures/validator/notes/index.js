const ValidationErrorHandler = require('../../../Commons/exceptions/ValidationErrorHandler');
const { NotePayloadSchema, NoteByIdParamsSchema } = require('./schema');

const NotesValidator = {
  validatePostNotePayload: (payload) => {
    const validationResult = NotePayloadSchema.validate(payload);

    if (validationResult.error) {
      ValidationErrorHandler(validationResult);
    }
  },

  validateGetNoteByIdParams: (params) => {
    const validationResult = NoteByIdParamsSchema.validate(params);

    if (validationResult.error) {
      ValidationErrorHandler(validationResult);
    }
  },

  validatePutNoteParams: (params) => {
    const validationResult = NoteByIdParamsSchema.validate(params);

    if (validationResult.error) {
      ValidationErrorHandler(validationResult);
    }
  },

  validatePutNotePayload: (payload) => {
    const validationResult = NotePayloadSchema.validate(payload);

    if (validationResult.error) {
      ValidationErrorHandler(validationResult);
    }
  },
};

module.exports = NotesValidator;
