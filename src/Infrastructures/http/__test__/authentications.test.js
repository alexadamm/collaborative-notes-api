const request = require('supertest');
const AuthenticationsTableTestHelper = require('../../../../__test__/AuthenticationsTableTestHelper');
const DatabaseTestHelper = require('../../../../__test__/DatabaseTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/authentications endpoint', () => {
  afterAll(async () => {
    await pool.$disconnect();
  });

  afterEach(async () => {
    await DatabaseTestHelper.cleanTable();
  });

  describe('when POST /authentications', () => {
    it('should response 201 and new authentication tokens', async () => {
      // Arrange
      const requestPayload = {
        username: 'johndoe',
        password: 'password',
      };
      const app = await createServer(container);

      await request(app).post('/users').send({ ...requestPayload, fullname: 'John Doe' });

      // Action
      const response = await request(app).post('/authentications').send(requestPayload);

      // Assert
      const { accessToken, refreshToken } = response.body.data;
      expect(response.statusCode).toEqual(201);
      expect(response.body.isSuccess).toEqual(true);
      expect(response.body.message).toEqual('Authentication added successfully');
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
    });

    it('should response 401 when username or password incorrect', async () => {
      // Arrange
      const payload = {
        username: 'johndoe',
        password: 'secret',
      };

      const app = await createServer(container);

      // Action
      const response = await request(app).post('/authentications').send(payload);

      // Assert
      const { message } = response.body.errors;
      expect(response.statusCode).toEqual(401);
      expect(response.body.isSuccess).toEqual(false);
      expect(message).toContain('Wrong credentials. Invalid username or password');
    });
  });

  describe('when DELETE /authentications', () => {
    it('should response 200 if refresh token valid', async () => {
      // Arrange
      const app = await createServer(container);
      const refreshToken = 'refresh_token';
      await AuthenticationsTableTestHelper.addToken(refreshToken);

      // Action
      const response = await request(app).delete('/authentications').send({ refreshToken });

      // Assert
      expect(response.statusCode).toEqual(200);
      expect(response.body.isSuccess).toEqual(true);
      expect(response.body.message).toEqual('Authentication deleted successfully');
    });

    it('should response 404 if refresh token not registered in database', async () => {
      // Arrange
      const app = await createServer(container);
      const refreshToken = 'refresh_token';

      const response = await request(app).delete('/authentications').send({ refreshToken });

      // Assert
      const { token } = response.body.errors;
      expect(response.statusCode).toEqual(404);
      expect(response.body.isSuccess).toEqual(false);
      expect(token).toContain('Refresh token is not found');
    });

    it('should response 400 if payload did not contain refresh token', async () => {
      // Arrange
      const app = await createServer(container);

      // Action
      const response = await request(app).delete('/authentications').send({});

      // Assert
      const { refreshToken } = response.body.errors;
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(refreshToken).toContain('"refreshToken" is required');
    });
  });
});
