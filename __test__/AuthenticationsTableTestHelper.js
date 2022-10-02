/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const AuthenticationsTableTestHelper = {
  async findToken(token) {
    return pool.authentications.findUnique({ where: { token } });
  },

  async addToken(token) {
    return pool.authentications.create({ data: { token } });
  },

  async cleanTable() {
    await pool.authentications.deleteMany();
  },
};

module.exports = AuthenticationsTableTestHelper;
