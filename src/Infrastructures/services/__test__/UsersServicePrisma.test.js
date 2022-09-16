const UsersTableTestHelper = require('../../../../__test__/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AddedUser = require('../../../Domains/users/entities/AddedUser');
const pool = require('../../database/postgres/pool');
const UsersServicePrisma = require('../UsersServicePrisma');

describe('UsersServicePrima', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.$disconnect();
  });

  describe('verifyAvailableUsername method', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'johndoe' });
      const usersServicePrisma = new UsersServicePrisma(pool);

      // Action and Assert
      await expect(usersServicePrisma.verifyAvailableUsername('johndoe')).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const usersServicePrisma = new UsersServicePrisma(pool);

      // Action and Assert
      await expect(usersServicePrisma.verifyAvailableUsername('johndoe')).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser method', () => {
    it('should persist add user correctly', async () => {
      // Arrange
      const payload = {
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      };
      const usersServicePrisma = new UsersServicePrisma(pool);

      // Action
      await usersServicePrisma.addUser(payload);

      // Assertconst
      const user = await UsersTableTestHelper.findUserByUsername(payload.username);
      expect(user).toHaveLength(1);
    });

    it('should return addedUser correctly', async () => {
      // Arrange
      const payload = {
        id: '12345678-abcd-abcd-abcd-123456789012',
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      };
      const usersServicePrisma = new UsersServicePrisma(pool);

      // Action
      const addedUser = await usersServicePrisma.addUser(payload);

      // Assert
      expect(addedUser).toStrictEqual(new AddedUser({
        id: payload.id,
        username: payload.username,
        fullname: payload.fullname,
      }));
    });
  });
});
