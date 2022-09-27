const jwt = require('jsonwebtoken');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthenticationTokenManagerJwt = require('../AuthenticationTokenManagerJwt');

describe('AuthenticationTokenManagerJwt', () => {
  describe('createAccessToken method', () => {
    it('should create accessToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'johndoe',
      };
      const spySign = jest.spyOn(jwt, 'sign');
      const jwtTokenManager = new AuthenticationTokenManagerJwt(jwt);

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      // Assert
      expect(spySign).toBeCalledWith(payload, process.env.ACCESS_TOKEN_KEY, {
        expiresIn: process.env.ACCESS_TOKEN_AGE,
      });
      expect(accessToken.length).toEqual(156);
    });
  });

  describe('createRefreshToken method', () => {
    it('should create refreshToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'johndoe',
      };
      const spySign = jest.spyOn(jwt, 'sign');
      const jwtTokenManager = new AuthenticationTokenManagerJwt(jwt);

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      // Assert
      expect(spySign).toBeCalledWith(payload, process.env.REFRESH_TOKEN_KEY);
      expect(refreshToken.length).toEqual(133);
    });
  });

  describe('verifyRefreshToken method', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const payload = {
        username: 'johndoe',
        password: 'hello',
      };
      const jwtTokenManager = new AuthenticationTokenManagerJwt(jwt);
      /** use accessToken instead of refreshToken to make it error */
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      // Action and Assert
      await expect(jwtTokenManager.verifyRefreshToken(accessToken))
        .rejects.toThrowError(InvariantError);
    });
    it('should not throw InvariantError when verification success', async () => {
      // Arrange
      const payload = {
        username: 'johndoe',
      };
      const jwtTokenManager = new AuthenticationTokenManagerJwt(jwt);
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      // Action and Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .resolves.not.toThrowError(InvariantError);
    });
  });

  describe('decodePayload method', () => {
    it('should decode payload successfully', async () => {
      // Arrange
      const payload = {
        username: 'johndoe',
      };
      const jwtTokenManager = new AuthenticationTokenManagerJwt(jwt);
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      // Action
      const decodedPayload = await jwtTokenManager.decodePayload(accessToken);

      // Assert
      expect(decodedPayload).toEqual(payload);
    });
  });
});
