const NotesService = require('../../../Domains/notes/NotesService');
const NotesValidator = require('../../../Infrastructures/validator/notes');
const UpdateNoteUseCase = require('../UpdateNoteUseCase');
const NoteDetail = require('../../../Domains/notes/entities/NoteDetail');
const CollaborationsService = require('../../../Domains/collaborations/CollaborationsService');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('UpdateNoteUseCase', () => {
  it('should orchestrating the update note action correctly when user is owner', async () => {
    // Arrange
    const useCasePayload = {
      title: 'updated title',
      content: 'updated content',
    };
    const useCaseParam = {
      noteId: 'note-123',
    };
    const useCaseUserId = 'user-123';
    const expectedUpdatedNote = new NoteDetail({
      ...useCasePayload,
      owner: 'johndoe',
      updatedAt: '11-09-2001',
      createdAt: '11-09-2000',
    });

    const mockNotesValidator = NotesValidator;
    const mockNotesService = new NotesService();
    const mockCollaborationService = new CollaborationsService();

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
    mockCollaborationService.verifyCollaborator = jest.fn()
      .mockImplementation(() => Promise.reject(new AuthorizationError('Forbidden Access')));

    const updateNoteUseCase = new UpdateNoteUseCase({
      notesValidator: mockNotesValidator,
      notesService: mockNotesService,
    });

    // Action
    const updatedNote = await updateNoteUseCase
      .execute(useCasePayload, useCaseParam, useCaseUserId);

    // Assert
    expect(updatedNote).toStrictEqual(expectedUpdatedNote);
    expect(mockNotesValidator.validatePutNoteParams).toBeCalledWith(useCaseParam);
    expect(mockNotesValidator.validatePutNotePayload).toBeCalledWith(useCasePayload);
    expect(mockNotesService.getNoteById).toBeCalledWith(useCaseParam.noteId);
    expect(mockNotesService.verifyNoteOwner).toBeCalledWith(useCaseUserId, useCaseParam.noteId);
    expect(mockNotesService.updateNote).toBeCalledWith(useCaseParam.noteId, useCasePayload);
  });

  it('should orchestrating the update note action correctly when user is collaborator', async () => {
    // Arrange
    const useCasePayload = {
      title: 'updated title',
      content: 'updated content',
    };
    const useCaseParam = {
      noteId: 'note-123',
    };
    const useCaseUserId = 'user-123';
    const expectedUpdatedNote = new NoteDetail({
      ...useCasePayload,
      owner: 'johndoe',
      updatedAt: '11-09-2001',
      createdAt: '11-09-2000',
    });

    const mockNotesValidator = NotesValidator;
    const mockNotesService = new NotesService();
    const mockCollaborationService = new CollaborationsService();

    mockNotesValidator.validatePutNoteParams = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockNotesValidator.validatePutNotePayload = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockNotesService.getNoteById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockNotesService.verifyNoteOwner = jest.fn()
      .mockImplementation(() => Promise.reject(new AuthorizationError('Forbidden Access')));
    mockNotesService.updateNote = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedUpdatedNote));
    mockCollaborationService.verifyCollaborator = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const updateNoteUseCase = new UpdateNoteUseCase({
      notesValidator: mockNotesValidator,
      notesService: mockNotesService,
      collaborationsService: mockCollaborationService,
    });

    // Action
    const updatedNote = await updateNoteUseCase
      .execute(useCasePayload, useCaseParam, useCaseUserId);

    // Assert
    expect(updatedNote).toStrictEqual(expectedUpdatedNote);
    expect(mockNotesValidator.validatePutNoteParams).toBeCalledWith(useCaseParam);
    expect(mockNotesValidator.validatePutNotePayload).toBeCalledWith(useCasePayload);
    expect(mockNotesService.getNoteById).toBeCalledWith(useCaseParam.noteId);
    expect(mockNotesService.verifyNoteOwner).toBeCalledWith(useCaseUserId, useCaseParam.noteId);
    expect(mockCollaborationService.verifyCollaborator)
      .toBeCalledWith({ noteId: useCaseParam.noteId, userId: useCaseUserId });
  });

  it('should throw error when user is neither owner nor collaborator', async () => {
    // Arrange
    const useCasePayload = {
      title: 'updated title',
      content: 'updated content',
    };
    const useCaseParam = {
      noteId: 'note-123',
    };
    const useCaseUserId = 'user-123';

    const mockNotesValidator = NotesValidator;
    const mockNotesService = new NotesService();

    mockNotesValidator.validatePutNoteParams = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockNotesValidator.validatePutNotePayload = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockNotesService.getNoteById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockNotesService.verifyNoteOwner = jest.fn()
      .mockImplementation(() => Promise.reject(new AuthorizationError('Forbidden Access')));
    mockNotesService.updateNote = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const updateNoteUseCase = new UpdateNoteUseCase({
      notesValidator: mockNotesValidator,
      notesService: mockNotesService,
    });

    // Action & Assert
    await expect(updateNoteUseCase.execute(useCasePayload, useCaseParam, useCaseUserId))
      .rejects.toThrow(AuthorizationError);
  });
});
