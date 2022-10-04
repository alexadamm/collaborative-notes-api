const AddedNote = require('../../Domains/notes/entities/AddedNote');
const NotesService = require('../../Domains/notes/NotesService');

class NotesServicePrisma extends NotesService {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addNote(newNote) {
    const note = await this._pool.notes.create({ data: newNote });
    return new AddedNote(note);
  }
}

module.exports = NotesServicePrisma;
