const AuthenticationService = require('../../Domains/authentications/AuthenticationService');

class AuthenticationServicePrisma extends AuthenticationService {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addToken(token) {
    await this._pool.authentications.create({ data: { token } });
  }
}
module.exports = AuthenticationServicePrisma;
