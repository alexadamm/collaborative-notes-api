const NoteDetail = require('../../Domains/notes/entities/NoteDetail');

class UpdateNoteUseCase {
  constructor({ notesValidator, notesService }) {
    this.notesValidator = notesValidator;
    this.notesService = notesService;
  }

  async execute(payload, params, ownerId) {
    this.notesValidator.validatePutNoteParams(params);
    this.notesValidator.validatePutNotePayload(payload);

    const { noteId } = params;
    const newNoteDetail = new NoteDetail(payload);

    await this.notesService.getNoteById(noteId);
    await this.notesService.verifyNoteOwner(ownerId, noteId);

    return this.notesService.updateNote(noteId, payload);
  }
}

module.exports = UpdateNoteUseCase;
