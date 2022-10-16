const NewNote = require('../NewNote');

describe('NewNote entity', () => {
  it('should create NewNote object correctly', () => {
    // Arrange
    const payload = {
      ownerId: '12345678-user-abcd-abcd-123',
      title: 'notes title',
      content: 'lorem ipsum dolor sit amet, consectetur adipiscing element',
    };

    // Action
    const newNote = new NewNote(payload);

    // Assert
    expect(newNote.ownerId).toEqual(payload.ownerId);
    expect(newNote.title).toEqual(payload.title);
    expect(newNote.content).toEqual(payload.content);
  });
});
