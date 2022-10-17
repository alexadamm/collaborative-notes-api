const NotesService = require('../../../Domains/notes/NotesService');
const NotesValidator = require('../../../Infrastructures/validator/notes');
const DeleteNoteByIdUseCase = require('../DeleteNoteByIdUseCase');

describe('DeleteNoteByIdUseCase', () => {
  it('should orchestrating the delete note action correctly', async () => {
    // Arrange
    const useCaseParams = {
      noteId: 'note-123',
    };
    const useCaseUserId = 'user-123';

    const mockNotesValidator = NotesValidator;
    const mockNotesService = new NotesService();

    mockNotesValidator.validateDeleteNoteParams = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockNotesService.getNoteById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockNotesService.verifyNoteOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockNotesService.deleteNoteById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteNoteByIdUseCase = new DeleteNoteByIdUseCase({
      notesValidator: mockNotesValidator,
      notesService: mockNotesService,
    });

    // Action
    await deleteNoteByIdUseCase.execute(useCaseParams, useCaseUserId);

    // Assert
    expect(mockNotesValidator.validateDeleteNoteParams)
      .toBeCalledWith(useCaseParams);
    expect(mockNotesService.getNoteById)
      .toBeCalledWith(useCaseParams.noteId);
    expect(mockNotesService.verifyNoteOwner)
      .toBeCalledWith(useCaseUserId, useCaseParams.noteId);
    expect(mockNotesService.deleteNoteById)
      .toBeCalledWith(useCaseParams.noteId);
  });
});
