const NotFoundError = require('../../Commons/exceptions/NotFoundError');
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
      .findUnique({ where: { username }, select: { id: true } });

    if (result) {
      throw new InvariantError('Username is already taken.');
    }
  }

  async addUser(newUser) {
    const user = await this._pool.users
      .create({ data: newUser, select: { id: true, username: true, fullname: true } });

    return new AddedUser(user);
  }

  async getUsersByUsername(username) {
    const results = await this._pool.users.findMany({
      where: { username: { contains: username } },
      select: { id: true, username: true, fullname: true },
    });

    return results.map((user) => new AddedUser(user));
  }

  async getUserById(userId) {
    const result = await this._pool.users.findUnique(
      {
        where: { id: userId },
        select: { id: true, username: true, fullname: true },
      },
    );

    if (!result) {
      throw new NotFoundError('User not found');
    }

    return new AddedUser(result);
  }
}

module.exports = UsersServicePrisma;
