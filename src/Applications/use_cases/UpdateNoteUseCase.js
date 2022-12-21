const NoteDetail = require('../../Domains/notes/entities/NoteDetail');

class UpdateNoteUseCase {
  constructor({ notesValidator, notesService, collaborationsService }) {
    this.notesValidator = notesValidator;
    this.notesService = notesService;
    this.collaborationsService = collaborationsService;
  }

  async execute(payload, params, userId) {
    this.notesValidator.validatePutNoteParams(params);
    this.notesValidator.validatePutNotePayload(payload);

    const { noteId } = params;
    const newNoteDetail = new NoteDetail(payload);

    await this.notesService.getNoteById(noteId);
    await this._verifyUserAccessibility(userId, noteId);

    return this.notesService.updateNote(noteId, newNoteDetail);
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

module.exports = UpdateNoteUseCase;
