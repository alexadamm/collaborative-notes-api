class DeleteNoteByIdUseCase {
  constructor({ notesValidator, notesService }) {
    this.notesValidator = notesValidator;
    this.notesService = notesService;
  }

  async execute(params, ownerId) {
    this.notesValidator.validateDeleteNoteParams(params);

    const { noteId } = params;

    await this.notesService.getNoteById(noteId);
    await this.notesService.verifyNoteOwner(ownerId, noteId);

    return this.notesService.deleteNoteById(noteId);
  }
}

module.exports = DeleteNoteByIdUseCase;
