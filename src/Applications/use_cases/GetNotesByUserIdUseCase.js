class GetNotesByUserIdUseCase {
  constructor({ notesService }) {
    this._notesService = notesService;
  }

  async execute(userId) {
    const notes = await this._notesService.getAllNotes(userId);
    return notes;
  }
}

module.exports = GetNotesByUserIdUseCase;
