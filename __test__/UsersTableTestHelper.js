const pool = require('../src/Infrastructures/database/postgres/pool');

const UsersTableTestHelper = {
  async addUser({
    id = '12345678-abcd-abcd-abcd-123456789012',
    username = 'johndoe', password = 'secret',
    fullname = 'John Doe',
  }) {
    await pool.users.create({
      data: {
        id, username, password, fullname,
      },
    });
  },

  async findUserByUsername(username) {
    return pool.users.findMany({ where: { username } });
  },

  async cleanTable() {
    await pool.users.deleteMany();
  },
};

module.exports = UsersTableTestHelper;
