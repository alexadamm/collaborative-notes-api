const AddedNote = require('../AddedNote');

describe('AddedNote entity', () => {
  it('should create AddedNote object correctly', () => {
    // Arrange
    const payload = {
      id: '12345678-note-abcd-abcd-123456789012',
      ownerId: '12345678-user-abcd-abcd-123',
      title: 'notes title',
      content: 'lorem ipsum dolor sit amet, consectetur adipiscing element',
      updatedAt: '11-9-2001',
      createdAt: '11-9-2000',
    };

    // Action
    const addedNote = new AddedNote(payload);

    // Assert
    expect(addedNote.id).toEqual(payload.id);
    expect(addedNote.ownerId).toEqual(payload.ownerId);
    expect(addedNote.title).toEqual(payload.title);
    expect(addedNote.content).toEqual(payload.content);
    expect(addedNote.updatedAt).toEqual(payload.updatedAt);
    expect(addedNote.createdAt).toEqual(payload.createdAt);
  });
});
