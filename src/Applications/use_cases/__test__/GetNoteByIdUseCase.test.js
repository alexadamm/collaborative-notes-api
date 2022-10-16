const NotesService = require('../../../Domains/notes/NotesService');
const NoteDetail = require('../../../Domains/notes/entities/NoteDetail');
const NotesValidator = require('../../../Infrastructures/validator/notes');
const GetNoteByIdUseCase = require('../GetNoteByIdUseCase');

describe('GetNoteByIdUseCase', () => {
  it('should orchestrating the get note by id action correctly', async () => {
    // Arrange
    const useCaseParams = { noteId: '12345678-abcd-abcd-abcd-abcd-123456789012' };

    const expectedNote = new NoteDetail({
      owner: 'johndoe',
      title: 'note title',
      content: 'lorem ipsum dolor sit amet',
      createdAt: '11-9-2000',
      updatedAt: '11-9-2001',
    });

    const mockNotesValidator = NotesValidator;
    const mockNotesService = new NotesService();

    mockNotesValidator.validateGetNoteByIdParams = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockNotesService.getNoteById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedNote));

    const getNoteByIdUseCase = new GetNoteByIdUseCase({
      notesService: mockNotesService, notesValidator: mockNotesValidator,
    });

    // Action
    const note = await getNoteByIdUseCase.execute(useCaseParams);

    // Assert
    expect(note).toStrictEqual(expectedNote);
    expect(mockNotesValidator.validateGetNoteByIdParams).toBeCalledWith(useCaseParams);
    expect(mockNotesService.getNoteById).toBeCalledWith(useCaseParams.noteId);
  });
});
