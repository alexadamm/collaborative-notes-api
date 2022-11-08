/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const AuthenticationsTableTestHelper = {
  async findToken(token) {
    return pool.Authentication.findUnique({ where: { token } });
  },

  async addToken(token) {
    return pool.Authentication.create({ data: { token } });
  },

  async deleteToken(token) {
    await pool.Authentication.delete({ where: { token } });
  },

  async cleanTable() {
    await pool.Authentication.deleteMany();
  },
};

module.exports = AuthenticationsTableTestHelper;
