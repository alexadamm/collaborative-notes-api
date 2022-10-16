const NewNote = require('../../Domains/notes/entities/NewNote');

class AddNoteUseCase {
  constructor({
    notesValidator, notesService,
  }) {
    this.notesValidator = notesValidator;
    this.notesService = notesService;
  }

  async execute(payload, ownerId) {
    this.notesValidator.validatePostNotePayload(payload);
    const newNote = new NewNote({ ...payload, ownerId });
    return this.notesService.addNote(newNote);
  }
}

module.exports = AddNoteUseCase;
