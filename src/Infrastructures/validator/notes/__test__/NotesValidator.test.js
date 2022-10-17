const NotesValidator = require('..');
const InvariantError = require('../../../../Commons/exceptions/InvariantError');

describe('NotesValidator', () => {
  describe('post note request payload', () => {
    it('should throw InvariantError when length of title is greater than 100', () => {
      // Arrange
      const payload = {
        title: 'abc'.repeat(50),
        content: 'lorem ipsum dolor sit amet',
      };

      // Action and Assert
      expect(() => NotesValidator.validatePostNotePayload(payload))
        .toThrowError(InvariantError);
    });

    it('should not throw InvariantError when validated', () => {
      // Arrange
      const payload = {
        title: 'a title',
        content: 'lorem ipsum dolor sit amet',
      };

      // Actiom and Assert
      expect(() => NotesValidator.validatePostNotePayload(payload))
        .not.toThrowError(InvariantError);
    });
  });

  describe('get note by id request params', () => {
    it('should throw InvariantError when params did not meet data type specification', () => {
      // Arrange
      const params = {
        noteId: '123',
      };

      // Action and Assert
      expect(() => NotesValidator.validateGetNoteByIdParams(params))
        .toThrowError(InvariantError);
    });

    it('should not throw InvariantError when validated', () => {
      // Arrange
      const params = {
        noteId: '12345678-abcd-abcd-abcd-123456789012',
      };

      // Actiom and Assert
      expect(() => NotesValidator.validateGetNoteByIdParams(params))
        .not.toThrowError(InvariantError);
    });
  });

  describe('put note request params', () => {
    it('should throw InvariantError when params did not meet data type specification', () => {
      // Arrange
      const params = {
        noteId: '123',
      };

      // Action and Assert
      expect(() => NotesValidator.validatePutNoteParams(params))
        .toThrowError(InvariantError);
    });

    it('should not throw InvariantError when validated', () => {
      // Arrange
      const params = {
        noteId: '12345678-abcd-abcd-abcd-123456789012',
      };

      // Actiom and Assert
      expect(() => NotesValidator.validatePutNoteParams(params))
        .not.toThrowError(InvariantError);
    });
  });

  describe('put note request payload', () => {
    it('should throw InvariantError when length of title is greater than 100', () => {
      // Arrange
      const payload = {
        title: 'abc'.repeat(50),
        content: 'lorem ipsum dolor sit amet',
      };

      // Action and Assert
      expect(() => NotesValidator.validatePutNotePayload(payload))
        .toThrowError(InvariantError);
    });

    it('should not throw InvariantError when validated', () => {
      // Arrange
      const payload = {
        title: 'a title',
        content: 'lorem ipsum dolor sit amet',
      };

      // Actiom and Assert
      expect(() => NotesValidator.validatePutNotePayload(payload))
        .not.toThrowError(InvariantError);
    });
  });
});
