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
      const { userId, accessToken } = await ServerTestHelper.newUser({ request, app }, {});

      // Action
      const response = await request(app).post('/notes').send(payload).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      const responseStatus = response.status;
      const {
        id, title, content, ownerId, updatedAt, createdAt,
      } = response.body.data;
      expect(responseStatus).toEqual(201);
      expect(id).toBeDefined();
      expect(title).toEqual(payload.title);
      expect(content).toEqual(payload.content);
      expect(ownerId).toEqual(userId);
      expect(updatedAt).toBeDefined();
      expect(createdAt).toBeDefined();
    });
  });
});
