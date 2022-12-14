const request = require('supertest');
const createServer = require('../createServer');
const container = require('../../container');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const DatabaseTestHelper = require('../../../../tests/DatabaseTestHelper');

describe('HTTP server', () => {
  afterEach(async () => {
    await DatabaseTestHelper.cleanTable();
  });

  it('should response 404 when request to unregistered route', async () => {
    // Arrange
    const app = await createServer({});

    // Action
    const response = await request(app).get('/unregisteredRoute');

    // Assert
    expect(response.statusCode).toEqual(404);
    expect(response.body.errors.message).toEqual('Page not found');
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const app = await createServer({});

    // Action
    const response = await request(app).post('/users');

    expect(response.statusCode).toEqual(500);
    expect(response.body.isSuccess).toEqual(false);
    expect(response.body.errors.message).toEqual('an error occured on our server');
  });

  it('should throw AuthenticationError when no token is provided', async () => {
    // Arrange
    const app = await createServer({});

    // Action
    const response = await request(app).post('/notes');

    // Assert
    const { errors } = response.body;
    expect(response.statusCode).toEqual(401);
    expect(response.body.isSuccess).toEqual(false);
    expect(errors).toContain('No token provided');
  });

  it('should not throw AuthenticationError when token is provided', async () => {
    // Arrange
    const app = await createServer(container);
    const { accessToken } = await ServerTestHelper.newUser({ request, app }, {});

    // Action
    const response = await request(app).post('/notes').set('Authorization', `Bearer ${accessToken}`);

    // Assert
    expect(response.statusCode).not.toEqual(401);
  });
});
