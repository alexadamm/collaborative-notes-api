const ValidationErrorHandler = require('../../../Commons/exceptions/ValidationErrorHandler');
const { PostAuthenticationSchema, DeleteAuthenticationSchema } = require('./schema');

const AuthenticationValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const validationResult = PostAuthenticationSchema.validate(payload);

    if (validationResult.error) {
      ValidationErrorHandler(validationResult);
    }
  },

  validateDeleteAuthenticationPayload: (payload) => {
    const validationResult = DeleteAuthenticationSchema.validate(payload);

    if (validationResult.error) {
      ValidationErrorHandler(validationResult);
    }
  },
};

module.exports = AuthenticationValidator;
