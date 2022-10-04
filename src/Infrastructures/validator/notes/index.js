const ValidationErrorHandler = require('../../../Commons/exceptions/ValidationErrorHandler');
const { PostNotePayloadSchema } = require('./schema');

const NotesValidator = {
  validatePostNotePayload: (payload) => {
    const validationResult = PostNotePayloadSchema.validate(payload);

    if (validationResult.error) {
      ValidationErrorHandler(validationResult);
    }
  },
};

module.exports = NotesValidator;
