class GetNoteByIdUseCase {
  constructor({
    notesService, notesValidator, collaborationsService,
  }) {
    this.notesService = notesService;
    this.notesValidator = notesValidator;
    this.collaborationsService = collaborationsService;
  }

  async execute(params, userId) {
    this.notesValidator.validateGetNoteByIdParams(params);
    const note = await this.notesService.getNoteById(params.noteId);
    await this._verifyUserAccessibility(userId, params.noteId);
    return note;
  }

  async _verifyUserAccessibility(userId, noteId) {
    try {
      await this.notesService.verifyNoteOwner(userId, noteId);
    } catch (error) {
      try {
        await this.collaborationsService.verifyCollaborator({ noteId, userId });
      } catch {
        throw error;
      }
    }
  }
}

module.exports = GetNoteByIdUseCase;
