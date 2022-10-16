const NoteDetail = require('../../Domains/notes/entities/NoteDetail');
const NotesService = require('../../Domains/notes/NotesService');

class NotesServicePrisma extends NotesService {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addNote(newNote) {
    const note = await this._pool.Note.create({
      data: newNote,
      include: {
        owner: {
          select: { username: true },
        },
      },
    });
    return new NoteDetail({ ...note, owner: note.owner.username });
  }
}

module.exports = NotesServicePrisma;
