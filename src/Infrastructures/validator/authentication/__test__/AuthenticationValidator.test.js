const AuthenticationValidator = require('../index');
const InvariantError = require('../../../../Commons/exceptions/InvariantError');

describe('AuthenticationValidator', () => {
  describe('post authentication request payload', () => {
    it('should throw InvariantError when payload not contain needed property', () => {
      // Arrange
      const payload = {
        username: 'johndoe',
      };

      // Action and Assert
      expect(() => AuthenticationValidator.validatePostAuthenticationPayload(payload))
        .toThrowError(InvariantError);
    });

    it('should throw InvariantError when payload did not meet data type specification', () => {
      // Arrange
      const payload = {
        username: 123,
        password: [],
      };

      // Action and Assert
      expect(() => AuthenticationValidator.validatePostAuthenticationPayload(payload))
        .toThrowError(InvariantError);
    });

    it('should throw InvariantError when username more than 50 character', () => {
      // Arrange
      const payload = {
        username: 'johndoe'.repeat(50),
        password: 'secret',
      };

      // Action and Assert
      expect(() => AuthenticationValidator.validatePostAuthenticationPayload(payload))
        .toThrowError(InvariantError);
    });

    it('should throw InvariantError when username contain restricted character', () => {
      // Arrange
      const payload = {
        username: 'john doe!',
        password: 'secret',
      };

      // Action and Assert
      expect(() => AuthenticationValidator.validatePostAuthenticationPayload(payload))
        .toThrowError(InvariantError);
    });

    it('should not throw InvariantError when validated', () => {
      // Arrange
      const payload = {
        username: 'johndoe',
        password: 'secret',
      };

      // Action and Assert
      expect(() => AuthenticationValidator.validatePostAuthenticationPayload(payload))
        .not.toThrowError(InvariantError);
    });
  });
});
