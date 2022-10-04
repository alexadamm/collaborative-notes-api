const AddNote = require('../AddNote');

describe('AddNote entity', () => {
  it('should create AddNote object correctly', () => {
    // Arrange
    const payload = {
      ownerId: '12345678-user-abcd-abcd-123',
      title: 'notes title',
      content: 'lorem ipsum dolor sit amet, consectetur adipiscing element',
    };

    // Action
    const addNote = new AddNote(payload);

    // Assert
    expect(addNote.ownerId).toEqual(payload.ownerId);
    expect(addNote.title).toEqual(payload.title);
    expect(addNote.content).toEqual(payload.content);
  });
});
