const NewCollaboration = require('../NewCollaboration');

describe('NewCollaboration entity', () => {
  it('should create NewCollaboration object correctly', async () => {
    // Arrange
    const requirements = {
      noteId: 'note-123',
      userId: 'user-123',
    };

    // Action
    const newCollaboration = new NewCollaboration(requirements);

    // Assert
    expect(newCollaboration.noteId).toEqual(requirements.noteId);
    expect(newCollaboration.userId).toEqual(requirements.userId);
  });
});
