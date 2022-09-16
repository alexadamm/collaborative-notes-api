const InvariantError = require('../../Commons/exceptions/InvariantError');
const AddedUser = require('../../Domains/users/entities/AddedUser');
const UsersService = require('../../Domains/users/UsersService');

class UsersServicePrisma extends UsersService {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async verifyAvailableUsername(username) {
    const result = await this._pool.users
      .findUnique({ where: { username } });

    if (result) {
      throw new InvariantError('Username is already taken.');
    }
  }

  async addUser(newUser) {
    const { id, username, fullname } = await this._pool.users
      .create({ data: newUser });

    return new AddedUser({ id, username, fullname });
  }
}

module.exports = UsersServicePrisma;
