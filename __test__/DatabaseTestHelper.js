/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const DatabaseTestHelper = {
  async cleanTable() {
    await pool.Note.deleteMany();
    await pool.User.deleteMany();
    await pool.Authentication.deleteMany();
  },
};

module.exports = DatabaseTestHelper;
