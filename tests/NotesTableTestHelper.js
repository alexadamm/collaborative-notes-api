/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const NotesTableTestHelper = {
  async findNoteByOwnerId(ownerId) {
    return pool.Note.findMany({ where: { ownerId } });
  },

  async addNote({
    id, title = 'A title', content = 'lorem ipsum dolor sit amet', ownerId,
  }) {
    if (id) {
      await pool.Note.create({
        data: {
          id, title, content, ownerId,
        },
        select: { id: true },
      });
      return id;
    }
    const { id: noteId } = await pool.Note.create({
      data: {
        title, content, ownerId,
      },
      select: { id: true },
    });
    return noteId;
  },

  async cleanTable() {
    await pool.Note.deleteMany();
  },
};

module.exports = NotesTableTestHelper;
