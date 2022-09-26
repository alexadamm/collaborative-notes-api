const request = require('supertest');

const UsersTableTestHelper = require('../../../../__test__/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/users endpoint', () => {
  afterAll(async () => {
    await pool.$disconnect();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
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
      expect(response.body.message).toEqual('Username is already taken.');
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
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const payload = {
        username: 123,
        password: 'secret',
        fullname: 'John Doe',
      };

      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(payload);

      // Assert
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
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
    });
  });
});
