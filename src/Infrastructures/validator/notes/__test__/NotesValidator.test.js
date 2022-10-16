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
});