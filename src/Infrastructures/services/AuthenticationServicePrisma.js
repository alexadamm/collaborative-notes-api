const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthenticationService = require('../../Domains/authentications/AuthenticationService');

class AuthenticationServicePrisma extends AuthenticationService {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addToken(token) {
    await this._pool.Authentication.create({ data: { token } });
  }

  async checkTokenAvailability(token) {
    const result = await this._pool.Authentication.findUnique({ where: { token } });
    if (!result) {
      throw new NotFoundError({ token: ['Refresh token is not found'] });
    }
  }

  async deleteToken(token) {
    await this._pool.Authentication.delete({ where: { token } });
  }
}
module.exports = AuthenticationServicePrisma;
