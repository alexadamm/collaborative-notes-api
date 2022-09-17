const request = require('supertest');
const app = require('../createServer');

describe('HTTP server', () => {
  it('should response 404 when request to unregistered route', async () => {
    // Arrange & Action
    const response = await request(app).get('/unregisteredRoute');

    // Assert
    expect(response.statusCode).toEqual(404);
    expect(response.body.message).toEqual('Page not found');
  });
});
