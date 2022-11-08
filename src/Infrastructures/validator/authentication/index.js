const ValidationErrorHandler = require('../../../Commons/exceptions/ValidationErrorHandler');
const { PostAuthenticationSchema, DeleteAuthenticationSchema, PutAuthenticationSchema } = require('./schema');

const AuthenticationValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const validationResult = PostAuthenticationSchema.validate(payload, { abortEarly: false });

    if (validationResult.error) {
      ValidationErrorHandler(validationResult);
    }
  },

  validateDeleteAuthenticationPayload: (payload) => {
    const validationResult = DeleteAuthenticationSchema.validate(payload, { abortEarly: false });

    if (validationResult.error) {
      ValidationErrorHandler(validationResult);
    }
  },

  validatePutAuthenticationPayload: (payload) => {
    const validationResult = PutAuthenticationSchema.validate(payload, { abortEarly: false });

    if (validationResult.error) {
      ValidationErrorHandler(validationResult);
    }
  },
};

module.exports = AuthenticationValidator;
