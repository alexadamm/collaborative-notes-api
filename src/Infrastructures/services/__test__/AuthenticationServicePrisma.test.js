const AuthenticationsTableTestHelper = require('../../../../__test__/AuthenticationsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
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
    it('should throw InvariantError when token is not found', async () => {
      // Arrange
      const expectedToken = 'refreshToken';
      const authenticationServicePrisma = new AuthenticationServicePrisma(pool);

      // Action and Assert
      await expect(authenticationServicePrisma.checkTokenAvailability(expectedToken))
        .rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when token is found', async () => {
      // Arrange
      const expectedToken = 'refreshToken';
      await AuthenticationsTableTestHelper.addToken(expectedToken);
      const authenticationServicePrisma = new AuthenticationServicePrisma(pool);

      // Action and Assert
      await expect(authenticationServicePrisma.checkTokenAvailability(expectedToken))
        .resolves.not.toThrowError(InvariantError);
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
