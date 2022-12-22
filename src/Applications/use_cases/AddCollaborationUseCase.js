const InvariantError = require('../../Commons/exceptions/InvariantError');
const NewCollaboration = require('../../Domains/collaborations/entities/NewCollaboration');

class AddCollaborationUseCase {
  constructor({
    collaborationsValidator,
    usersService,
    notesService,
    collaborationsService,
  }) {
    this.usersService = usersService;
    this.collaborationsService = collaborationsService;
    this.notesService = notesService;
    this.collaborationsValidator = collaborationsValidator;
  }

  async execute(params, payload, userId) {
    this.collaborationsValidator.validatePostCollaborationParams(params);
    this.collaborationsValidator.validatePostCollaborationPayload(payload);
    await this.notesService.getNoteById(params.noteId);
    await this.usersService.getUserById(userId);
    await this.notesService.verifyNoteOwner(userId, params.noteId);
    const id = await this.usersService.getIdByUsername(payload.username);
    if (id === userId) {
      throw new InvariantError('You cannot add yourself as a collaborator');
    }
    const newCollaboration = new NewCollaboration({ userId: id, ...params });
    return this.collaborationsService.addCollaboration(newCollaboration);
  }
}

module.exports = AddCollaborationUseCase;
