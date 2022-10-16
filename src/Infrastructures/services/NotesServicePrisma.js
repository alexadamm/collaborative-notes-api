const NotFoundError = require('../../Commons/exceptions/NotFoundError');
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

  async getNoteById(id) {
    const result = await this._pool.Note.findUnique({
      where: { id },
      include: {
        owner: {
          select: { username: true },
        },
      },
    });

    if (!result) {
      throw new NotFoundError();
    }

    return new NoteDetail({ ...result, owner: result.owner.username });
  }

  async getAllNotes(ownerId) {
    const notes = await this._pool.Note.findMany(
      { where: { ownerId }, include: { owner: true }, orderBy: { createdAt: 'desc' } },
    );

    return notes.map((note) => new NoteDetail({ ...note, owner: note.owner.username }));
  }
}

module.exports = NotesServicePrisma;
