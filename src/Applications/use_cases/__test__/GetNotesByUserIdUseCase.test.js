const GetNotesByUserIdUseCase = require('../GetNotesByUserIdUseCase');
const NoteDetail = require('../../../Domains/notes/entities/NoteDetail');
const NotesService = require('../../../Domains/notes/NotesService');

describe('GetNotesByUserIdUseCase', () => {
  it('should orchestrating the get notes by user action correctly', async () => {
    // Arrange
    const useCaseUserId = 'user-123';
    const expectedNote = {
      title: 'note title',
      content: 'note content',
      owner: 'johndoe',
      updatedAt: '11-9-2001',
      createdAt: '11-9-2001',
    };
    const expectedNotes = [
      new NoteDetail({
        ...expectedNote,
        id: 'note-123',
      }),
      new NoteDetail({
        ...expectedNote,
        id: 'note-456',
      }),
    ];
    const mockNotesService = new NotesService();
    mockNotesService.getAllNotes = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedNotes));

    const getNotesByUserIdUseCase = new GetNotesByUserIdUseCase({
      notesService: mockNotesService,
    });

    // Action
    const notes = await getNotesByUserIdUseCase.execute(useCaseUserId);

    // Assert
    expect(notes).toEqual(expectedNotes);
    expect(mockNotesService.getAllNotes).toBeCalledWith(useCaseUserId);
  });
});
