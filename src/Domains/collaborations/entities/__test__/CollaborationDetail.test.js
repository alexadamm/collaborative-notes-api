const CollaborationDetail = require('../CollaborationDetail');

describe('CollaborationDetail entity', () => {
  it('should create CollaborationDetail object correctly', async () => {
    // Arrange
    const payload = {
      noteId: 'note-123',
      username: 'johndoe',
      id: 'collaboration-123',
    };

    // Action
    const collaborationDetail = new CollaborationDetail(payload);

    // Assert
    expect(collaborationDetail.noteId).toEqual(payload.noteId);
    expect(collaborationDetail.username).toEqual(payload.username);
    expect(collaborationDetail.id).toEqual(payload.id);
  });
});
