const request = require('supertest');

const ServerTestHelper = require('../../../../__test__/ServerTestHelper');
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

    it('should response 400 if refresh token not registered in database', async () => {
      // Arrange
      const app = await createServer(container);
      const refreshToken = 'refresh_token';

      const response = await request(app).delete('/authentications').send({ refreshToken });

      // Assert
      const { token } = response.body.errors;
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(token).toContain('Invalid token');
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

  describe('when PUT /authentications', () => {
    it('should response 200 and access token', async () => {
      // Arrange
      const app = await createServer(container);

      const { refreshToken } = await ServerTestHelper.newUser({ request, app }, { username: 'johndoe' });

      // Action
      const response = await request(app).put('/authentications').send({ refreshToken });

      // Assert
      const { accessToken } = response.body.data;
      expect(response.statusCode).toEqual(200);
      expect(response.body.isSuccess).toEqual(true);
      expect(response.body.message).toEqual('Access token created successfully');
      expect(accessToken).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const app = await createServer(container);

      // Action
      const response = await request(app).put('/authentications').send({});

      // Assert
      const { refreshToken } = response.body.errors;
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(refreshToken).toContain('"refreshToken" is required');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const app = await createServer(container);

      // Action
      const response = await request(app).put('/authentications').send({ refreshToken: 123 });

      // Assert
      const { refreshToken } = response.body.errors;
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(refreshToken).toContain('"refreshToken" must be a string');
    });

    it('should response 400 when refresh token not found', async () => {
      // Arrange
      const app = await createServer(container);

      const { refreshToken } = await ServerTestHelper.newUser({ request, app }, { username: 'johndoe' });
      await AuthenticationsTableTestHelper.deleteToken(refreshToken);

      // Action
      const response = await request(app).put('/authentications').send({ refreshToken });

      // Assert
      const { token } = response.body.errors;
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(token).toContain('Invalid token');
    });
  });
});
