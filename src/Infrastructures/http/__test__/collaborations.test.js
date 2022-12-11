const request = require('supertest');
const DatabaseTestHelper = require('../../../../tests/DatabaseTestHelper');
const NotesTableTestHelper = require('../../../../tests/NotesTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/notes/{noteId}/collaborations endpoint', () => {
  afterEach(async () => {
    await DatabaseTestHelper.cleanTable();
  });

  describe('when POST /notes/{noteId}/collaborations', () => {
    it('should response 201 and persisted collaboration', async () => {
      // Arrange
      const username = 'foo';
      const payload = {
        username,
      };
      const app = await createServer(container);
      const { accessToken, userId: ownerId } = await ServerTestHelper.newUser({ request, app }, { username: 'johndoe' });
      await ServerTestHelper.newUser({ request, app }, { username });
      const noteId = await NotesTableTestHelper.addNote({ ownerId });

      // Action
      const response = await request(app).post(`/notes/${noteId}/collaborations`).send(payload).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      const { addedCollaboration } = response.body.data;
      expect(response.statusCode).toEqual(201);
      expect(response.body.isSuccess).toEqual(true);
      expect(addedCollaboration.noteId).toEqual(noteId);
      expect(addedCollaboration.username).toEqual(username);
      expect(addedCollaboration.id).toBeDefined();
    });

    it('should response 401 when request without access token', async () => {
      // Arrange
      const username = 'foo';
      const payload = {
        username,
      };
      const app = await createServer(container);
      const { userId: ownerId } = await ServerTestHelper.newUser({ request, app }, { username: 'johndoe' });
      await ServerTestHelper.newUser({ request, app }, { username });
      const noteId = await NotesTableTestHelper.addNote({ ownerId });

      // Action
      const response = await request(app).post(`/notes/${noteId}/collaborations`).send(payload);

      // Assert
      const { errors } = response.body;
      expect(response.statusCode).toEqual(401);
      expect(response.body.isSuccess).toEqual(false);
      expect(errors).toContain('No token provided');
    });

    it('should response 403 when try to add collaborator of notes that\'s not theirs', async () => {
      // Arrange
      const username = 'foo';
      const payload = {
        username,
      };
      const app = await createServer(container);
      const { accessToken } = await ServerTestHelper.newUser({ request, app }, {
        username: 'johndoe',
      });
      await ServerTestHelper.newUser({ request, app }, {
        username,
      });
      const { userId: ownerId } = await ServerTestHelper.newUser({ request, app }, {
        username: 'bar',
      });
      const noteId = await NotesTableTestHelper.addNote({ ownerId });

      // Action
      const response = await request(app).post(`/notes/${noteId}/collaborations`).send(payload).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      const { errors } = response.body;
      expect(response.statusCode).toEqual(403);
      expect(response.body.isSuccess).toEqual(false);
      expect(errors).toContain('You do not have access to this resource');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const payload = {};
      const app = await createServer(container);
      const { accessToken, userId: ownerId } = await ServerTestHelper.newUser({ request, app }, { username: 'johndoe' });
      const noteId = await NotesTableTestHelper.addNote({ ownerId });

      // Action
      const response = await request(app).post(`/notes/${noteId}/collaborations`).send(payload).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      const { errors } = response.body;
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(errors).toContain('"username" is required');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const payload = {
        username: 123,
      };
      const app = await createServer(container);
      const { accessToken, userId: ownerId } = await ServerTestHelper.newUser({ request, app }, { username: 'johndoe' });
      const noteId = await NotesTableTestHelper.addNote({ ownerId });

      // Action
      const response = await request(app).post(`/notes/${noteId}/collaborations`).send(payload).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      const { errors } = response.body;
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(errors).toContain('"username" must be a string');
    });
  });
});