const NotesService = require('../../../Domains/notes/NotesService');
const NotesValidator = require('../../../Infrastructures/validator/notes');
const UpdateNoteUseCase = require('../UpdateNoteUseCase');
const NoteDetail = require('../../../Domains/notes/entities/NoteDetail');

describe('UpdateNoteUseCase', () => {
  it('should orchestrating the update note action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'updated title',
      content: 'updated content',
    };
    const useCaseParam = {
      noteId: 'note-123',
    };
    const useCaseOwner = 'user-123';
    const expectedUpdatedNote = new NoteDetail({
      ...useCasePayload,
      owner: 'johndoe',
      updatedAt: '11-09-2001',
      createdAt: '11-09-2000',
    });

    const mockNotesValidator = NotesValidator;
    const mockNotesService = new NotesService();

    mockNotesValidator.validatePutNoteParams = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockNotesValidator.validatePutNotePayload = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockNotesService.getNoteById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockNotesService.verifyNoteOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockNotesService.updateNote = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedUpdatedNote));

    const updateNoteUseCase = new UpdateNoteUseCase({
      notesValidator: mockNotesValidator,
      notesService: mockNotesService,
    });

    // Action
    const updatedNote = await updateNoteUseCase.execute(useCasePayload, useCaseParam, useCaseOwner);

    // Assert
    expect(updatedNote).toStrictEqual(expectedUpdatedNote);
    expect(mockNotesValidator.validatePutNoteParams).toBeCalledWith(useCaseParam);
    expect(mockNotesValidator.validatePutNotePayload).toBeCalledWith(useCasePayload);
    expect(mockNotesService.getNoteById).toBeCalledWith(useCaseParam.noteId);
    expect(mockNotesService.verifyNoteOwner).toBeCalledWith(useCaseOwner, useCaseParam.noteId);
    expect(mockNotesService.updateNote).toBeCalledWith(useCaseParam.noteId, useCasePayload);
  });
});
