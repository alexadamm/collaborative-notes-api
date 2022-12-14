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

  describe('delete authentication request payload', () => {
    it('should throw InvariantError when payload not contain refreshToken', () => {
      // Arrange
      const payload = {};

      // Action and Assert
      expect(() => AuthenticationValidator.validateDeleteAuthenticationPayload(payload))
        .toThrowError(InvariantError);
    });

    it('should not throw InvariantError when refreshToken did not meet data type specification', () => {
      // Arrange
      const payload = {
        refreshToken: 123,
      };

      // Action and Assert
      expect(() => AuthenticationValidator.validateDeleteAuthenticationPayload(payload))
        .toThrowError(InvariantError);
    });

    it('should not throw InvariantError when payload validated successfully', () => {
      // Arrange
      const payload = {
        refreshToken: 'refresh_token',
      };

      // Action and Assert
      expect(() => AuthenticationValidator.validateDeleteAuthenticationPayload(payload))
        .not.toThrowError(InvariantError);
    });
  });

  describe('put authentication request payload', () => {
    it('should throw InvariantError when payload not contain refreshToken', () => {
      // Arrange
      const payload = {};

      // Action and Assert
      expect(() => AuthenticationValidator.validatePutAuthenticationPayload(payload))
        .toThrowError(InvariantError);
    });

    it('should not throw InvariantError when refreshToken did not meet data type specification', () => {
      // Arrange
      const payload = {
        refreshToken: 123,
      };

      // Action and Assert
      expect(() => AuthenticationValidator.validatePutAuthenticationPayload(payload))
        .toThrowError(InvariantError);
    });

    it('should not throw InvariantError when payload validated successfully', () => {
      // Arrange
      const payload = {
        refreshToken: 'refresh_token',
      };

      // Action and Assert
      expect(() => AuthenticationValidator.validatePutAuthenticationPayload(payload))
        .not.toThrowError(InvariantError);
    });
  });
});
