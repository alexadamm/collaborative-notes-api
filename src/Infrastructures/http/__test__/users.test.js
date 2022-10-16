const request = require('supertest');
const DatabaseTestHelper = require('../../../../__test__/DatabaseTestHelper');

const UsersTableTestHelper = require('../../../../__test__/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/users endpoint', () => {
  afterAll(async () => {
    await pool.$disconnect();
  });

  afterEach(async () => {
    await DatabaseTestHelper.cleanTable();
  });

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const payload = {
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      };

      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(payload);

      // Assert
      const responseStatus = response.status;
      const { id, username, fullname } = response.body.data;
      const persistedUser = await UsersTableTestHelper.findUserByUsername(payload.username);

      expect(responseStatus).toEqual(201);
      expect(id).toBeDefined();
      expect(username).toEqual(payload.username);
      expect(fullname).toEqual(payload.fullname);
      expect(persistedUser).toHaveLength(1);
    });

    it('should response 400 when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'johndoe' });
      const payload = {
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      };

      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(payload);

      // Assert

      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(response.body.errors.username).toEqual('Username is already taken');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const payload = {
        username: 'johndoe',
      };

      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(payload);

      // Assert
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(response.body.errors.fullname[0]).toEqual('"fullname" is required');
      expect(response.body.errors.password[0]).toEqual('"password" is required');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const payload = {
        username: 123,
        password: {},
        fullname: true,
      };

      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(payload);

      // Assert
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(response.body.errors.username[0]).toEqual('"username" must be a string');
      expect(response.body.errors.fullname[0]).toEqual('"fullname" must be a string');
      expect(response.body.errors.password[0]).toEqual('"password" must be a string');
    });

    it('should response 400 when username more than 50 characters', async () => {
      // Arrange
      const payload = {
        username: 'johndoe'.repeat(50),
        password: 'secret',
        fullname: 'John Doe',
      };

      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(payload);

      // Assert
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(response.body.errors.username[0])
        .toEqual('"username" length must be less than or equal to 50 characters long');
    });

    it('should response 400 when username contain restricted character', async () => {
      // Arrange
      const payload = {
        username: 'johndoe!',
        password: 'secret',
        fullname: 'John Doe',
      };

      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(payload);

      // Assert
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(response.body.errors.username[0])
        .toEqual('"username" with value "johndoe!" fails to match the required pattern: /^[\\w]+$/');
    });
  });

  describe('when GET /users', () => {
    it('should response 200 and array of users', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'johndoe' });
      const app = await createServer(container);

      // Action
      const response = await request(app).get('/users');

      // Assert
      expect(response.statusCode).toEqual(200);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('when GET /users/{userId}', () => {
    it('should response 404 when user is not found', async () => {
      // Arrange
      const userId = '12345678-abcd-abcd-abcd-123456789012';
      const app = await createServer(container);

      // Action
      const response = await request(app).get(`/users/${userId}`);

      // Assert
      expect(response.statusCode).toEqual(404);
      expect(response.body.errors.id).toEqual('User not found');
    });

    it('should response 200 and user data', async () => {
      // Arrange
      const userId = '12345678-abcd-abcd-abcd-123456789012';
      await UsersTableTestHelper.addUser({ id: userId, username: 'johndoe' });
      const app = await createServer(container);

      // Action
      const response = await request(app).get(`/users/${userId}`);

      // Assert
      expect(response.statusCode).toEqual(200);
      expect(response.body.data.id).toEqual(userId);
    });
  });
});
