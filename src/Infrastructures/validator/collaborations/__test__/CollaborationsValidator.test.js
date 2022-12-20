const CollaborationsValidator = require('..');
const InvariantError = require('../../../../Commons/exceptions/InvariantError');

describe('CollaborationsValidator', () => {
  describe('post collaboration request params', () => {
    it('shouold throw InvariantError when payload did not meet data type specification', () => {
      // Arrange
      const params = {
        noteId: '123',
      };

      // Action and Assert
      expect(() => CollaborationsValidator.validatePostCollaborationParams(params))
        .toThrowError(InvariantError);
    });

    it('should not throw InvariantError when validated', () => {
      // Arrange
      const params = {
        noteId: '12345678-abcd-abcd-abcd-123456789012',
      };

      // Action and Assert
      expect(() => CollaborationsValidator.validatePostCollaborationParams(params))
        .not.toThrowError(InvariantError);
    });
  });

  describe('post collaboration request payload', () => {
    it('should throw InvariantError when payload did not contain needed property', () => {
      // Arrange
      const payload = {};

      // Action and Assert
      expect(() => CollaborationsValidator.validatePostCollaborationPayload(payload))
        .toThrowError(InvariantError);
    });

    it('should throw InvariantError when payload did not meet data type specification', () => {
      // Arrange
      const payload = {
        username: 123,
      };

      // Action and Assert
      expect(() => CollaborationsValidator.validatePostCollaborationPayload(payload))
        .toThrowError(InvariantError);
    });

    it('should not throw InvariantError when validated', () => {
      // Arrange
      const payload = {
        username: 'johndoe',
      };

      // Action and Assert
      expect(() => CollaborationsValidator.validatePostCollaborationPayload(payload))
        .not.toThrowError(InvariantError);
    });
  });

  describe('delete collaboration request params', () => {
    it('shouold throw InvariantError when payload did not meet data type specification', () => {
      // Arrange
      const params = {
        noteId: '123',
      };

      // Action and Assert
      expect(() => CollaborationsValidator.validateDeleteCollaborationParams(params))
        .toThrowError(InvariantError);
    });

    it('should not throw InvariantError when validated', () => {
      // Arrange
      const params = {
        noteId: '12345678-abcd-abcd-abcd-123456789012',
      };

      // Action and Assert
      expect(() => CollaborationsValidator.validateDeleteCollaborationParams(params))
        .not.toThrowError(InvariantError);
    });
  });

  describe('delete collaboration request payload', () => {
    it('should throw InvariantError when payload did not contain needed property', () => {
      // Arrange
      const payload = {};

      // Action and Assert
      expect(() => CollaborationsValidator.validateDeleteCollaborationPayload(payload))
        .toThrowError(InvariantError);
    });

    it('should throw InvariantError when payload did not meet data type specification', () => {
      // Arrange
      const payload = {
        username: 123,
      };

      // Action and Assert
      expect(() => CollaborationsValidator.validateDeleteCollaborationPayload(payload))
        .toThrowError(InvariantError);
    });

    it('should not throw InvariantError when validated', () => {
      // Arrange
      const payload = {
        username: 'johndoe',
      };

      // Action and Assert
      expect(() => CollaborationsValidator.validateDeleteCollaborationPayload(payload))
        .not.toThrowError(InvariantError);
    });
  });
});
