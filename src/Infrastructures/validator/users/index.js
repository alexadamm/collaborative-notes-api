const InvariantError = require('../../../Commons/exceptions/InvariantError');
const { PostUserPayloadSchema, GetUserByIdParamsSchema } = require('./schema');

const UsersValidator = {
  validatePostUserPayload: (payload) => {
    const validationResult = PostUserPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateGetUserByIdParams: (params) => {
    const validationResult = GetUserByIdParamsSchema.validate(params);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UsersValidator;
