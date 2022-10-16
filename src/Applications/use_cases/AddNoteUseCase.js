const AddNote = require('../../Domains/notes/entities/AddNote');

class AddNoteUseCase {
  constructor({
    notesValidator, notesService,
  }) {
    this.notesValidator = notesValidator;
    this.notesService = notesService;
  }

  async execute(payload, ownerId) {
    this.notesValidator.validatePostNotePayload(payload);
    const newNote = new AddNote({ ...payload, ownerId });
    return this.notesService.addNote(newNote);
  }
}

module.exports = AddNoteUseCase;
