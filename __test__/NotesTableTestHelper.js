/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const NotesTableTestHelper = {
  async findNoteByOwnerId(ownerId) {
    return pool.notes.findMany({ where: { ownerId } });
  },

  async cleanTable() {
    await pool.notes.deleteMany();
  },
};

module.exports = NotesTableTestHelper;
