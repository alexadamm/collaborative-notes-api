const pool = require('../src/Infrastructures/database/postgres/pool');

/* istanbul ignore file */
const CollaborationsTableTestHelper = {
  async findCollaborationsByNoteId(noteId) {
    return pool.Collaboration.findMany({ where: { noteId } });
  },

  async cleanTable() {
    await pool.Collaboration.deleteMany();
  },
};

module.exports = CollaborationsTableTestHelper;
