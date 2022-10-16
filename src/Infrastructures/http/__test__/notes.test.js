const request = require('supertest');
const ServerTestHelper = require('../../../../__test__/ServerTestHelper');
const createServer = require('../createServer');
const container = require('../../container');
const DatabaseTestHelper = require('../../../../__test__/DatabaseTestHelper');

describe('/notes endpoint', () => {
  afterEach(async () => {
    await DatabaseTestHelper.cleanTable();
  });
  describe('when POST /notes', () => {
    it('should return 201 and new note', async () => {
      // Arrange
      const payload = {
        title: 'new note',
        content: 'new note body',
      };
      const app = await createServer(container);
      const { accessToken } = await ServerTestHelper.newUser({ request, app }, { username: 'johndoe' });

      // Action
      const response = await request(app).post('/notes').send(payload).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      const responseStatus = response.status;
      const {
        id, title, content, owner, updatedAt, createdAt,
      } = response.body.data;
      expect(responseStatus).toEqual(201);
      expect(id).toBeDefined();
      expect(title).toEqual(payload.title);
      expect(content).toEqual(payload.content);
      expect(owner).toEqual('johndoe');
      expect(updatedAt).toBeDefined();
      expect(createdAt).toBeDefined();
    });

    it('should response 401 when request without access token', async () => {
      // Arrange
      const payload = {
        title: 'new note',
        content: 'new note body',
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/notes').send(payload);

      // Assert
      expect(response.statusCode).toEqual(401);
      expect(response.body.isSuccess).toEqual(false);
    });

    it('should response 401 when access token invalid', async () => {
      // Arrange
      const payload = {
        title: 'new note',
        content: 'new note body',
      };
      const app = await createServer(container);
      const accessToken = 'bearer token';

      // Action
      const response = await request(app).post('/notes').send(payload).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.statusCode).toEqual(401);
      expect(response.body.isSuccess).toEqual(false);
    });

    it('should response 400 when title greater than 100 long', async () => {
      // Arrange
      const payload = {
        title: 'title'.repeat(50),
        content: 'lorem ipsum dolor sit amet',
      };
      const app = await createServer(container);
      const { accessToken } = await ServerTestHelper.newUser({ request, app }, {});

      // Action
      const response = await request(app).post('/notes').send(payload).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(response.body.errors.title)
        .toEqual(['"title" length must be less than or equal to 100 characters long']);
    });
  });
});
