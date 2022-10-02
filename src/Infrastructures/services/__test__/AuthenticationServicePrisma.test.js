const AuthenticationsTableTestHelper = require('../../../../__test__/AuthenticationsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const AuthenticationServicePrisma = require('../AuthenticationServicePrisma');

describe('AuthenticationServicePrisma', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.$disconnect();
  });

  describe('addToken method', () => {
    it('should add token to database', async () => {
      // Arrange
      const authenticationServicePrisma = new AuthenticationServicePrisma(pool);
      const expectedToken = 'refreshToken';

      // Action
      await authenticationServicePrisma.addToken(expectedToken);

      // Assert
      const result = await AuthenticationsTableTestHelper.findToken(expectedToken);
      expect(result.token).toEqual(expectedToken);
    });
  });

  describe('checkTokenAvailability method', () => {
    it('should throw NotFoundError when token is not found', async () => {
      // Arrange
      const expectedToken = 'refreshToken';
      const authenticationServicePrisma = new AuthenticationServicePrisma(pool);

      // Action and Assert
      await expect(authenticationServicePrisma.checkTokenAvailability(expectedToken))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when token is found', async () => {
      // Arrange
      const expectedToken = 'refreshToken';
      await AuthenticationsTableTestHelper.addToken(expectedToken);
      const authenticationServicePrisma = new AuthenticationServicePrisma(pool);

      // Action and Assert
      await expect(authenticationServicePrisma.checkTokenAvailability(expectedToken))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('deleteToken method', () => {
    it('should delete token from database', async () => {
    // Arrange
      const expectedToken = 'refreshToken';
      await AuthenticationsTableTestHelper.addToken(expectedToken);
      const authenticationServicePrisma = new AuthenticationServicePrisma(pool);

      // Action
      await authenticationServicePrisma.deleteToken(expectedToken);

      // Assert
      const result = await AuthenticationsTableTestHelper.findToken(expectedToken);
      expect(result).toEqual(null);
    });
  });
});
