const UsersTableTestHelper = require('../../../../__test__/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AddedUser = require('../../../Domains/users/entities/AddedUser');
const pool = require('../../database/postgres/pool');
const UsersServicePrisma = require('../UsersServicePrisma');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');

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

  describe('getUsersByUsername method', () => {
    it('should return users correctly', async () => {
      // Arrange
      const payload = {
        id: '12345678-abcd-abcd-abcd-123456789012',
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      };
      await UsersTableTestHelper.addUser(payload);
      const usersServicePrisma = new UsersServicePrisma(pool);

      // Action
      const users = await usersServicePrisma.getUsersByUsername(payload.username);

      // Assert
      expect(users).toHaveLength(1);
    });
  });

  describe('getUserByUserId method', () => {
    it('should throw NotFoundError when user does not exist', async () => {
      // Arrange
      const userId = '12345678-abcd-abcd-abcd-123456789012';
      const usersServicePrisma = new UsersServicePrisma(pool);

      // Action and Assert
      await expect(usersServicePrisma.getUserById(userId)).rejects.toThrowError(NotFoundError);
    });

    it('should return user correctly', async () => {
      // Arrange
      const userId = '12345678-abcd-abcd-abcd-123456789012';
      await UsersTableTestHelper
        .addUser({ id: '12345678-abcd-abcd-abcd-123456789012', username: 'johndoe' });
      const usersServicePrisma = new UsersServicePrisma(pool);

      // Action
      const user = await usersServicePrisma.getUserById(userId);

      // Assert
      expect(user).toStrictEqual(new AddedUser({
        id: '12345678-abcd-abcd-abcd-123456789012',
        username: 'johndoe',
        fullname: 'John Doe',
      }));
    });
  });

  describe('getIdByUsername method', () => {
    it('should return InvariantError when username does not exist', async () => {
      // Arrange
      const username = 'johndoe';
      const usersServicePrisma = new UsersServicePrisma(pool);

      // Action and Assert
      await expect(usersServicePrisma.getIdByUsername(username))
        .rejects.toThrowError(InvariantError);
    });

    it('should return userId correctly', async () => {
      // Arrange
      const username = 'johndoe';
      const id = '12345678-abcd-abcd-abcd-123456789012';
      await UsersTableTestHelper.addUser({ id, username });
      const usersServicePrisma = new UsersServicePrisma(pool);

      // Action
      const userId = await usersServicePrisma.getIdByUsername(username);

      // Assert
      expect(userId).toEqual(id);
    });
  });

  describe('getPasswordByUsername method', () => {
    it('should return AuthenticationError when username does not exist', async () => {
      // Arrange
      const username = 'johndoe';
      const usersServicePrisma = new UsersServicePrisma(pool);

      // Action and Assert
      await expect(usersServicePrisma.getPasswordByUsername(username))
        .rejects.toThrowError(AuthenticationError);
    });
    it('should return userPassword correctly', async () => {
      // Arrange
      const username = 'johndoe';
      const password = 'secret';
      await UsersTableTestHelper.addUser({ username, password });
      const usersServicePrisma = new UsersServicePrisma(pool);

      // Action
      const userPassword = await usersServicePrisma.getPasswordByUsername(username);

      // Assert
      expect(userPassword).toEqual(password);
    });
  });
});
