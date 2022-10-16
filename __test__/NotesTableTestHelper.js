/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const NotesTableTestHelper = {
  async findNoteByOwnerId(ownerId) {
    return pool.Note.findMany({ where: { ownerId } });
  },

  async addNote({ title = 'A title', content = 'lorem ipsum dolor sit amet', ownerId }) {
    const { id } = await pool.Note.create({
      data: {
        title, content, ownerId,
      },
      select: { id: true },
    });
    return id;
  },

  async cleanTable() {
    await pool.Note.deleteMany();
  },
};

module.exports = NotesTableTestHelper;
