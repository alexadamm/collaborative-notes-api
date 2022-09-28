const AuthenticationsTableTestHelper = require('../../../../__test__/AuthenticationsTableTestHelper');
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
});
