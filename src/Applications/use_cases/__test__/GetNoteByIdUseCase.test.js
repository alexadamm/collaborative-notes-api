const NotesService = require('../../../Domains/notes/NotesService');
const NoteDetail = require('../../../Domains/notes/entities/NoteDetail');
const NotesValidator = require('../../../Infrastructures/validator/notes');
const GetNoteByIdUseCase = require('../GetNoteByIdUseCase');
const CollaborationsService = require('../../../Domains/collaborations/CollaborationsService');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('GetNoteByIdUseCase', () => {
  it('should orchestrating the get note by id action correctly when user is owner', async () => {
    // Arrange
    const useCaseParams = { noteId: '12345678-abcd-abcd-abcd-abcd-123456789012' };
    const useCaseUserId = 'user-123';

    const expectedNote = new NoteDetail({
      owner: 'johndoe',
      title: 'note title',
      content: 'lorem ipsum dolor sit amet',
      createdAt: '11-9-2000',
      updatedAt: '11-9-2001',
    });

    const mockNotesValidator = NotesValidator;
    const mockNotesService = new NotesService();
    const mockCollaborationService = new CollaborationsService();

    mockNotesValidator.validateGetNoteByIdParams = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockNotesService.getNoteById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedNote));
    mockNotesService.verifyNoteOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCollaborationService.verifyCollaborator = jest.fn()
      .mockImplementation(() => Promise.reject(new AuthorizationError('Forbidden Access')));

    const getNoteByIdUseCase = new GetNoteByIdUseCase({
      notesService: mockNotesService, notesValidator: mockNotesValidator,
    });

    // Action
    const note = await getNoteByIdUseCase.execute(useCaseParams, useCaseUserId);

    // Assert
    expect(note).toStrictEqual(expectedNote);
    expect(mockNotesValidator.validateGetNoteByIdParams).toBeCalledWith(useCaseParams);
    expect(mockNotesService.getNoteById).toBeCalledWith(useCaseParams.noteId);
    expect(mockNotesService.verifyNoteOwner).toBeCalledWith(useCaseUserId, useCaseParams.noteId);
  });

  it('should orchestrating the get note by id action correctly when user is collaborator', async () => {
    // Arrange
    const useCaseParam = {
      noteId: 'note-123',
    };
    const useCaseUserId = 'user-123';

    const expectedNote = new NoteDetail({
      owner: 'johndoe',
      title: 'note title',
      content: 'lorem ipsum dolor sit amet',
      createdAt: '11-9-2000',
      updatedAt: '11-9-2001',
    });

    const mockNotesValidator = NotesValidator;
    const mockNotesService = new NotesService();
    const mockCollaborationService = new CollaborationsService();

    mockNotesValidator.validateGetNoteByIdParams = jest.fn()
      .mockImplementation(() => undefined);
    mockNotesService.getNoteById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedNote));
    mockNotesService.verifyNoteOwner = jest.fn()
      .mockImplementation(() => Promise.reject(new AuthorizationError('Forbidden Access')));
    mockCollaborationService.verifyCollaborator = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const getNoteByIdUseCase = new GetNoteByIdUseCase({
      notesService: mockNotesService,
      notesValidator: mockNotesValidator,
      collaborationsService: mockCollaborationService,
    });

    // Action
    const note = await getNoteByIdUseCase.execute(useCaseParam, useCaseUserId);

    // Assert
    expect(note).toStrictEqual(expectedNote);
    expect(mockNotesValidator.validateGetNoteByIdParams).toBeCalledWith(useCaseParam);
    expect(mockNotesService.verifyNoteOwner).toBeCalledWith(useCaseUserId, useCaseParam.noteId);
    expect(mockNotesService.getNoteById).toBeCalledWith(useCaseParam.noteId);
    expect(mockCollaborationService.verifyCollaborator)
      .toBeCalledWith({ userId: useCaseUserId, noteId: useCaseParam.noteId });
  });

  it('should throw error when user is neither owner nor collaborator', async () => {
    // Arrange
    const useCaseParam = {
      noteId: 'note-123',
    };
    const useCaseUserId = 'user-123';

    const mockNotesValidator = NotesValidator;
    const mockNotesService = new NotesService();
    const mockCollaborationService = new CollaborationsService();

    mockNotesValidator.validateGetNoteByIdParams = jest.fn()
      .mockImplementation(() => undefined);
    mockNotesService.getNoteById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockNotesService.verifyNoteOwner = jest.fn()
      .mockImplementation(() => Promise.reject(new AuthorizationError('Forbidden Access')));
    mockCollaborationService.verifyCollaborator = jest.fn()
      .mockImplementation(() => Promise.reject(new AuthorizationError('Forbidden Access')));

    const getNoteByIdUseCase = new GetNoteByIdUseCase({
      notesService: mockNotesService,
      notesValidator: mockNotesValidator,
      collaborationsService: mockCollaborationService,
    });

    // Action and Assert
    await expect(getNoteByIdUseCase.execute(useCaseParam, useCaseUserId))
      .rejects.toThrowError(AuthorizationError);
  });
});
