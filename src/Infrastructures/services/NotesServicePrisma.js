const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
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
      throw new NotFoundError(['Note not found']);
    }

    return new NoteDetail({ ...result, owner: result.owner.username });
  }

  async getAllNotes(ownerId) {
    const notes = await this._pool.Note.findMany(
      { where: { ownerId }, include: { owner: true }, orderBy: { createdAt: 'desc' } },
    );

    return notes.map((note) => new NoteDetail({ ...note, owner: note.owner.username }));
  }

  async verifyNoteOwner(userId, noteId) {
    const note = await this._pool.Note.findUnique({
      where: {
        id: noteId,
      },
      select: { ownerId: true },
    });

    if ((note.ownerId !== userId)) {
      throw new AuthorizationError(['You do not have access to this resource']);
    }
  }

  async updateNote(noteId, newNoteDetail) {
    const note = await this._pool.Note.update(
      {
        where: { id: noteId },
        data: newNoteDetail,
        include: {
          owner: {
            select: { username: true },
          },
        },
      },
    );

    return new NoteDetail({ ...note, owner: note.owner.username });
  }

  async deleteNoteById(noteId) {
    await this._pool.Note.delete({ where: { id: noteId } });
  }
}

module.exports = NotesServicePrisma;
