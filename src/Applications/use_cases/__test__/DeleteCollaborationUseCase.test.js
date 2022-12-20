const CollaborationsService = require('../../../Domains/collaborations/CollaborationsService');
const NewCollaboration = require('../../../Domains/collaborations/entities/NewCollaboration');
const NotesService = require('../../../Domains/notes/NotesService');
const UsersService = require('../../../Domains/users/UsersService');
const CollaborationsValidator = require('../../../Infrastructures/validator/collaborations');
const DeleteCollaborationUseCase = require('../DeleteCollaborationUseCase');

describe('DeleteCollaborationUseCase', () => {
  it('should orchestrating the delete collaboration action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
    };
    const useCaseParams = {
      noteId: 'note-123',
    };
    const ownerId = 'user-123';
    const userId = 'user-345';
    const collaborationId = 'collaboration-123';

    const mockCollaborationsValidator = CollaborationsValidator;
    const mockCollaborationsService = new CollaborationsService();
    const mockUsersService = new UsersService();
    const mockNotesService = new NotesService();

    mockCollaborationsValidator.validateDeleteCollaborationPayload = jest.fn()
      .mockImplementation(() => undefined);
    mockCollaborationsValidator.validateDeleteCollaborationParams = jest.fn()
      .mockImplementation(() => undefined);
    mockNotesService.getNoteById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUsersService.getUserById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockNotesService.verifyNoteOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUsersService.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(userId));
    mockCollaborationsService.getCollaborationId = jest.fn()
      .mockImplementation(() => Promise.resolve(collaborationId));
    mockCollaborationsService.deleteCollaborationById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCollaborationUseCase = new DeleteCollaborationUseCase({
      collaborationsValidator: mockCollaborationsValidator,
      collaborationsService: mockCollaborationsService,
      usersService: mockUsersService,
      notesService: mockNotesService,
    });

    // Action
    await deleteCollaborationUseCase.execute(useCaseParams, useCasePayload, ownerId);

    // Assert
    expect(mockCollaborationsValidator.validateDeleteCollaborationParams)
      .toBeCalledWith(useCaseParams);
    expect(mockCollaborationsValidator.validateDeleteCollaborationPayload)
      .toBeCalledWith(useCasePayload);
    expect(mockNotesService.getNoteById)
      .toBeCalledWith(useCaseParams.noteId);
    expect(mockUsersService.getUserById)
      .toBeCalledWith(ownerId);
    expect(mockNotesService.verifyNoteOwner)
      .toBeCalledWith(ownerId, useCaseParams.noteId);
    expect(mockUsersService.getIdByUsername)
      .toBeCalledWith(useCasePayload.username);
    expect(mockCollaborationsService.getCollaborationId)
      .toBeCalledWith(new NewCollaboration({ userId, noteId: useCaseParams.noteId }));
    expect(mockCollaborationsService.deleteCollaborationById)
      .toBeCalledWith(collaborationId);
  });
});
