const NewCollaboration = require('../../Domains/collaborations/entities/NewCollaboration');

class DeleteCollaborationUseCase {
  constructor({
    collaborationsValidator,
    usersService,
    notesService,
    collaborationsService,
  }) {
    this.collaborationsValidator = collaborationsValidator;
    this.usersService = usersService;
    this.notesService = notesService;
    this.collaborationsService = collaborationsService;
  }

  async execute(params, payload, userId) {
    this.collaborationsValidator.validateDeleteCollaborationParams(params);
    this.collaborationsValidator.validateDeleteCollaborationPayload(payload);
    await this.notesService.getNoteById(params.noteId);
    await this.usersService.getUserById(userId);
    await this.notesService.verifyNoteOwner(userId, params.noteId);
    const id = await this.usersService.getIdByUsername(payload.username);
    const newCollaboration = new NewCollaboration({ userId: id, ...params });
    const collaborationId = await this.collaborationsService
      .getCollaborationId(newCollaboration);
    return this.collaborationsService.deleteCollaborationById(collaborationId);
  }
}

module.exports = DeleteCollaborationUseCase;
