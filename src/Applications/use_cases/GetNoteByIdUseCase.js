class GetNoteByIdUseCase {
  constructor({
    notesService, notesValidator,
  }) {
    this.notesService = notesService;
    this.notesValidator = notesValidator;
  }

  async execute(params) {
    this.notesValidator.validateGetNoteByIdParams(params);
    const note = await this.notesService.getNoteById(params.noteId);
    return note;
  }
}

module.exports = GetNoteByIdUseCase;
