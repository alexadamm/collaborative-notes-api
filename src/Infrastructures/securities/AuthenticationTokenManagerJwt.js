const AuthenticationTokenManager = require('../../Applications/securities/AuthenticationTokenManager');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class AuthenticationTokenManagerJwt extends AuthenticationTokenManager {
  constructor(jwt) {
    super();
    this.jwt = jwt;
  }

  async createAccessToken(payload) {
    return this.jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: process.env.ACCESS_TOKEN_AGE,
    });
  }

  async createRefreshToken(payload) {
    return this.jwt.sign(payload, process.env.REFRESH_TOKEN_KEY);
  }

  async verifyRefreshToken(token) {
    await this.jwt.verify(token, process.env.REFRESH_TOKEN_KEY, (err) => {
      if (err) {
        throw new InvariantError('Refresh token tidak valid');
      }
    });
  }

  async decodePayload(token) {
    const artifacts = this.jwt.decode(token);
    delete artifacts.iat;
    delete artifacts.exp;
    return artifacts;
  }
}

module.exports = AuthenticationTokenManagerJwt;
