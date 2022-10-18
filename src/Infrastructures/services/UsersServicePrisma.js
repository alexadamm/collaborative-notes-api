const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const AddedUser = require('../../Domains/users/entities/AddedUser');
const UsersService = require('../../Domains/users/UsersService');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');

class UsersServicePrisma extends UsersService {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async verifyAvailableUsername(username) {
    const result = await this._pool.User
      .findUnique({ where: { username }, select: { id: true } });

    if (result) {
      throw new InvariantError({ username: ['Username is already taken'] });
    }
  }

  async addUser(newUser) {
    const user = await this._pool.User
      .create({ data: newUser, select: { id: true, username: true, fullname: true } });

    return new AddedUser(user);
  }

  async getUsersByUsername(username) {
    const results = await this._pool.User.findMany({
      where: { username: { contains: username } },
      select: { id: true, username: true, fullname: true },
    });

    return results.map((user) => new AddedUser(user));
  }

  async getUserById(userId) {
    const result = await this._pool.User.findUnique(
      {
        where: { id: userId },
        select: { id: true, username: true, fullname: true },
      },
    );

    if (!result) {
      throw new NotFoundError({ id: ['User not found'] });
    }

    return new AddedUser(result);
  }

  async getIdByUsername(username) {
    const user = await this._pool.User.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      throw new InvariantError({ username: ['User does not exist'] });
    }

    return user.id;
  }

  async getPasswordByUsername(username) {
    const user = await this._pool.User.findUnique({
      where: { username },
      select: { password: true },
    });

    if (!user) {
      throw new AuthenticationError({ message: ['Wrong credentials. Invalid username or password'] });
    }

    return user.password;
  }
}

module.exports = UsersServicePrisma;
