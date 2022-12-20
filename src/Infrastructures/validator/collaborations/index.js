const ValidationErrorHandler = require('../../../Commons/exceptions/ValidationErrorHandler');
const { CollaborationParamsSchema, CollaborationPayloadSchema } = require('./schema');

const CollaborationsValidator = {
  validatePostCollaborationParams: (payload) => {
    const validationResult = CollaborationParamsSchema.validate(payload, { abortEarly: false });

    if (validationResult.error) {
      ValidationErrorHandler(validationResult);
    }
  },

  validatePostCollaborationPayload: (payload) => {
    const validationResult = CollaborationPayloadSchema.validate(payload, { abortEarly: false });

    if (validationResult.error) {
      ValidationErrorHandler(validationResult);
    }
  },

  validateDeleteCollaborationParams: (payload) => {
    const validationResult = CollaborationParamsSchema.validate(payload, { abortEarly: false });

    if (validationResult.error) {
      ValidationErrorHandler(validationResult);
    }
  },

  validateDeleteCollaborationPayload: (payload) => {
    const validationResult = CollaborationPayloadSchema.validate(payload, { abortEarly: false });

    if (validationResult.error) {
      ValidationErrorHandler(validationResult);
    }
  },

};

module.exports = CollaborationsValidator;
