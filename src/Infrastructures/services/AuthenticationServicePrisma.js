const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthenticationService = require('../../Domains/authentications/AuthenticationService');

class AuthenticationServicePrisma extends AuthenticationService {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addToken(token) {
    await this._pool.authentications.create({ data: { token } });
  }

  async checkTokenAvailability(token) {
    const result = await this._pool.authentications.findUnique({ where: { token } });
    if (!result) {
      throw new NotFoundError('Refresh token is not found');
    }
  }

  async deleteToken(token) {
    await this._pool.authentications.delete({ where: { token } });
  }
}
module.exports = AuthenticationServicePrisma;
