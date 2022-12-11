const CollaborationsService = require('../../../Domains/collaborations/CollaborationsService');
const CollaborationDetail = require('../../../Domains/collaborations/entities/CollaborationDetail');
const NewCollaboration = require('../../../Domains/collaborations/entities/NewCollaboration');
const NotesService = require('../../../Domains/notes/NotesService');
const UsersService = require('../../../Domains/users/UsersService');
const CollaborationsValidator = require('../../../Infrastructures/validator/collaborations');
const AddCollaborationUseCase = require('../AddCollaborationUseCase');

describe('AddCollaborationUseCase', () => {
  it('should orchestrating the add collaboration action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'johndoe',
    };

    const useCaseParams = {
      noteId: 'note-123',
    };

    const ownerId = 'user-123';
    const userId = 'user-234';

    const expectedAddedCollaboration = new CollaborationDetail({
      noteId: useCaseParams.noteId,
      username: useCasePayload.username,
      collaborationId: 'collaboration-123',
    });

    const mockCollaborationsValidator = CollaborationsValidator;
    const mockCollaborationsService = new CollaborationsService();
    const mockUsersService = new UsersService();
    const mockNotesService = new NotesService();

    mockCollaborationsValidator.validatePostCollaborationPayload = jest.fn()
      .mockImplementation(() => undefined);
    mockCollaborationsValidator.validatePostCollaborationParams = jest.fn()
      .mockImplementation(() => undefined);
    mockNotesService.getNoteById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUsersService.getUserById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockNotesService.verifyNoteOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUsersService.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(userId));
    mockCollaborationsService.addCollaboration = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedCollaboration));

    const addCollaborationUseCase = new AddCollaborationUseCase({
      collaborationsValidator: mockCollaborationsValidator,
      collaborationsService: mockCollaborationsService,
      usersService: mockUsersService,
      notesService: mockNotesService,
    });

    // Action
    const addedCollaboration = await addCollaborationUseCase
      .execute(useCaseParams, useCasePayload, ownerId);

    // Assert
    expect(addedCollaboration).toStrictEqual(expectedAddedCollaboration);
    expect(mockCollaborationsValidator.validatePostCollaborationPayload)
      .toBeCalledWith(useCasePayload);
    expect(mockCollaborationsValidator.validatePostCollaborationParams)
      .toBeCalledWith(useCaseParams);
    expect(mockNotesService.getNoteById).toBeCalledWith(useCaseParams.noteId);
    expect(mockUsersService.getUserById).toBeCalledWith(ownerId);
    expect(mockNotesService.verifyNoteOwner).toBeCalledWith(ownerId, useCaseParams.noteId);
    expect(mockUsersService.getIdByUsername).toBeCalledWith(useCasePayload.username);
    expect(mockCollaborationsService.addCollaboration)
      .toBeCalledWith(new NewCollaboration({ userId, noteId: useCaseParams.noteId }));
  });
});
