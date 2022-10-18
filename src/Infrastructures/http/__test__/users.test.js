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
      const { id, username, fullname } = response.body.data.addedUser;
      expect(response.statusCode).toEqual(201);
      expect(response.body.isSuccess).toEqual(true);
      expect(response.body.message).toEqual('User added successfully');
      expect(id).toBeDefined();
      expect(username).toEqual(payload.username);
      expect(fullname).toEqual(payload.fullname);
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
      const { username } = response.body.errors;
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(username).toContain('Username is already taken');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const payload = {
      };

      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(payload);

      // Assert
      const { username, fullname, password } = response.body.errors;
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(username).toContain('"username" is required');
      expect(fullname).toContain('"fullname" is required');
      expect(password).toContain('"password" is required');
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
      const { username, fullname, password } = response.body.errors;
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(username).toContain('"username" must be a string');
      expect(fullname).toContain('"fullname" must be a string');
      expect(password).toContain('"password" must be a string');
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
      const { username } = response.body.errors;
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(username)
        .toContain('"username" length must be less than or equal to 50 characters long');
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
      const { username } = response.body.errors;
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(username)
        .toContain('"username" with value "johndoe!" fails to match the required pattern: /^[\\w]+$/');
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
      const { users } = response.body.data;
      expect(response.statusCode).toEqual(200);
      expect(response.body.isSuccess).toEqual(true);
      expect(response.body.message).toEqual('Users retrieved successfully');
      expect(users).toHaveLength(1);
    });
  });

  describe('when GET /users/{userId}', () => {
    it('should response 200 and user data', async () => {
      // Arrange
      const userId = '12345678-abcd-abcd-abcd-123456789012';
      await UsersTableTestHelper.addUser({ id: userId, username: 'johndoe' });
      const app = await createServer(container);

      // Action
      const response = await request(app).get(`/users/${userId}`);

      // Assert
      const { user } = response.body.data;
      expect(response.statusCode).toEqual(200);
      expect(response.body.isSuccess).toEqual(true);
      expect(response.body.message).toEqual('User retrieved successfully');
      expect(user.id).toEqual(userId);
    });

    it('should response 404 when user is not found', async () => {
      // Arrange
      const userId = '12345678-abcd-abcd-abcd-123456789012';
      const app = await createServer(container);

      // Action
      const response = await request(app).get(`/users/${userId}`);

      // Assert
      const { id } = response.body.errors;
      expect(response.statusCode).toEqual(404);
      expect(id).toContain('User not found');
    });
  });
});
