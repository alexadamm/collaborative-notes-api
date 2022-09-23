const UsersValidator = require('..');
const InvariantError = require('../../../../Commons/exceptions/InvariantError');

describe('User requests validator', () => {
  describe('post user request payload', () => {
    it('should throw error when payload not contain needed property', () => {
      // Arrange
      const payload = {
        username: 'abc',
        fullname: 'abc',
      };

      // Action and Assert
      expect(() => UsersValidator.validatePostUserPayload(payload))
        .toThrowError(InvariantError);
    });

    it('should throw error when payload did not meet data type specification', () => {
      // Arrange
      const payload = {
        username: 123,
        password: 'abc',
        fullname: true,
      };

      /// Action and Assert
      expect(() => UsersValidator.validatePostUserPayload(payload))
        .toThrowError(InvariantError);
    });

    it('should throw error when length of username is more than 50', () => {
      // Arrange
      const payload = {
        username: 'abc'.repeat(50),
        password: 'abc',
        fullname: 'abc',
      };

      // Action and Assert
      expect(() => UsersValidator.validatePostUserPayload(payload))
        .toThrowError(InvariantError);
    });

    it('should throw error when username contain restricted character', () => {
      // Arrange
      const payload = {
        username: 'abc a',
        password: 'abc',
        fullname: 'abc',
      };

      // Action and Assert
      expect(() => UsersValidator.validatePostUserPayload(payload))
        .toThrowError(InvariantError);
    });
  });
});
