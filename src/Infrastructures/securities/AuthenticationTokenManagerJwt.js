const AuthenticationTokenManager = require('../../Applications/securities/AuthenticationTokenManager');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');
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
        throw new InvariantError(['Invalid token']);
      }
    });
  }

  async verifyAccessToken(token) {
    await this.jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err) => {
      if (err) {
        throw new AuthenticationError(['Invalid auth token']);
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
