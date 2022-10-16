const NoteDetail = require('../NoteDetail');

describe('NoteDetail entity', () => {
  it('should create NoteDetail object correctly', () => {
    // Arrange
    const payload = {
      id: '12345678-note-abcd-abcd-123456789012',
      owner: 'johndoe',
      title: 'notes title',
      content: 'lorem ipsum dolor sit amet, consectetur adipiscing element',
      updatedAt: '11-9-2001',
      createdAt: '11-9-2000',
    };

    // Action
    const noteDetail = new NoteDetail(payload);

    // Assert
    expect(noteDetail.id).toEqual(payload.id);
    expect(noteDetail.owner).toEqual(payload.owner);
    expect(noteDetail.title).toEqual(payload.title);
    expect(noteDetail.content).toEqual(payload.content);
    expect(noteDetail.updatedAt).toEqual(payload.updatedAt);
    expect(noteDetail.createdAt).toEqual(payload.createdAt);
  });
});
