const AddNote = require('../../Domains/notes/entities/AddNote');

class AddNoteUseCase {
  constructor({
    authenticationTokenManager, usersService, notesValidator, notesService,
  }) {
    this.authenticationTokenManager = authenticationTokenManager;
    this.usersService = usersService;
    this.notesValidator = notesValidator;
    this.notesService = notesService;
  }

  async execute(payload, token) {
    const { id: ownerId } = await this.authenticationTokenManager.decodePayload(token);
    await this.usersService.getUserById(ownerId);
    this.notesValidator.validatePostNotePayload(payload);
    const newNote = new AddNote({ ...payload, ownerId });
    return this.notesService.addNote(newNote);
  }
}

module.exports = AddNoteUseCase;
