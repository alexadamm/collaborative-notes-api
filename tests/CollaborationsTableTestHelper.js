const pool = require('../src/Infrastructures/database/postgres/pool');

/* istanbul ignore file */
const CollaborationsTableTestHelper = {
  async findCollaborationsByNoteId(noteId) {
    return pool.Collaboration.findMany({ where: { noteId } });
  },

  async addCollaboration({ id, noteId, userId }) {
    if (id) {
      await pool.Collaboration.create({
        data: {
          id, noteId, userId,
        },
        select: { id: true },
      });
      return id;
    }
    const { id: collaborationId } = await pool.Collaboration.create({
      data: {
        noteId, userId,
      },
      select: { id: true },
    });
    return collaborationId;
  },

  async cleanTable() {
    await pool.Collaboration.deleteMany();
  },
};

module.exports = CollaborationsTableTestHelper;
