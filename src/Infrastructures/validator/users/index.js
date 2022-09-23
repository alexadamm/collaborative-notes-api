const InvariantError = require('../../../Commons/exceptions/InvariantError');
const { PostUserPayloadSchema } = require('./schema');

const UsersValidator = {
  validatePostUserPayload: (payload) => {
    const validationResult = PostUserPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UsersValidator;
