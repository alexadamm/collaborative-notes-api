const request = require('supertest');
const ServerTestHelper = require('../../../../__test__/ServerTestHelper');
const createServer = require('../createServer');
const container = require('../../container');
const DatabaseTestHelper = require('../../../../__test__/DatabaseTestHelper');
const NotesTableTestHelper = require('../../../../__test__/NotesTableTestHelper');

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
      } = response.body.data.addedNote;
      expect(responseStatus).toEqual(201);
      expect(response.body.isSuccess).toEqual(true);
      expect(response.body.message).toEqual('Note added successfully');
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
      const { message } = response.body.errors;
      expect(response.statusCode).toEqual(401);
      expect(response.body.isSuccess).toEqual(false);
      expect(message).toContain('No token provided');
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
      const { token } = response.body.errors;
      expect(response.statusCode).toEqual(401);
      expect(response.body.isSuccess).toEqual(false);
      expect(token).toContain('Invalid auth token');
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
      const { title } = response.body.errors;
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(title)
        .toContain('"title" length must be less than or equal to 100 characters long');
    });
  });

  describe('when GET /notes', () => {
    it('should response 200 and list of notes', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.newUser({ request, app }, { username: 'johndoe' });
      await NotesTableTestHelper.addNote({
        title: 'note 1', content: 'note 1 body', ownerId: userId,
      });
      await NotesTableTestHelper.addNote({
        title: 'note 2', content: 'note 2 body', ownerId: userId,
      });

      // Action
      const response = await request(app).get('/notes').set('Authorization', `Bearer ${accessToken}`);

      // Assert
      const { notes } = response.body.data;
      expect(response.statusCode).toEqual(200);
      expect(response.body.isSuccess).toEqual(true);
      expect(response.body.message).toEqual('Notes retrieved successfully');
      expect(notes).toHaveLength(2);
      expect(notes[0].owner).toEqual('johndoe');
      expect(notes[1].owner).toEqual('johndoe');
    });

    it('should return 401 when request without access token', async () => {
      // Arrange
      const app = await createServer(container);

      // Action
      const response = await request(app).get('/notes');

      // Assert
      const { message } = response.body.errors;
      expect(response.statusCode).toEqual(401);
      expect(response.body.isSuccess).toEqual(false);
      expect(message).toContain('No token provided');
    });
  });

  it('should return 401 when access token invalid', async () => {
    // Arrange
    const app = await createServer(container);
    const accessToken = 'bearer token';

    // Action
    const response = await request(app).get('/notes').set('Authorization', `Bearer ${accessToken}`);

    // Assert
    const { token } = response.body.errors;
    expect(response.statusCode).toEqual(401);
    expect(response.body.isSuccess).toEqual(false);
    expect(token).toContain('Invalid auth token');
  });

  describe('when GET /notes/{noteId}', () => {
    it('should return 200 and note', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.newUser({ request, app }, { username: 'johndoe' });
      const noteId = await NotesTableTestHelper.addNote({
        title: 'note 1', content: 'note 1 body', ownerId: userId,
      });

      // Action
      const response = await request(app).get(`/notes/${noteId}`).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      const { note } = response.body.data;
      expect(response.statusCode).toEqual(200);
      expect(note.id).toEqual(noteId);
      expect(note.title).toEqual('note 1');
      expect(note.content).toEqual('note 1 body');
      expect(note.owner).toEqual('johndoe');
    });

    it('should return 404 when note not found', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken } = await ServerTestHelper.newUser({ request, app }, { username: 'johndoe' });
      const noteId = '12345678-abcd-abcd-abcd-123456789012';

      // Action
      const response = await request(app).get(`/notes/${noteId}`).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      const { noteId: idErrors } = response.body.errors;
      expect(response.statusCode).toEqual(404);
      expect(response.body.isSuccess).toEqual(false);
      expect(idErrors).toContain('Note not found');
    });

    it('should return 401 when request without access token', async () => {
      // Arrange
      const app = await createServer(container);
      const noteId = '12345678-abcd-abcd-abcd-123456789012';

      // Action
      const response = await request(app).get(`/notes/${noteId}`);

      // Assert
      const { message } = response.body.errors;
      expect(response.statusCode).toEqual(401);
      expect(response.body.isSuccess).toEqual(false);
      expect(message).toContain('No token provided');
    });
  });

  it('should return 401 when access token invalid', async () => {
    // Arrange
    const app = await createServer(container);
    const accessToken = 'bearer token';
    const noteId = '12345678-abcd-abcd-abcd-123456789012';

    // Action
    const response = await request(app).get(`/notes/${noteId}`).set('Authorization', `Bearer ${accessToken}`);

    // Assert
    const { token } = response.body.errors;
    expect(response.statusCode).toEqual(401);
    expect(response.body.isSuccess).toEqual(false);
    expect(token).toContain('Invalid auth token');
  });

  describe('when PUT /notes/{noteId}', () => {
    it('should return 200 and updated note', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.newUser({ request, app }, { username: 'johndoe' });
      const noteId = await NotesTableTestHelper.addNote({
        title: 'note 1', content: 'note 1 body', ownerId: userId,
      });
      const payload = {
        title: 'note 1 updated',
        content: 'note 1 body updated',
      };

      // Action
      const response = await request(app).put(`/notes/${noteId}`).send(payload).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      const { updatedNote } = response.body.data;
      expect(response.statusCode).toEqual(200);
      expect(response.body.isSuccess).toEqual(true);
      expect(response.body.message).toEqual('Note updated successfully');
      expect(updatedNote.id).toEqual(noteId);
      expect(updatedNote.title).toEqual('note 1 updated');
      expect(updatedNote.content).toEqual('note 1 body updated');
      expect(updatedNote.owner).toEqual('johndoe');
      expect(updatedNote.createdAt).toBeDefined();
      expect(updatedNote.updatedAt).toBeDefined();
    });

    it('should return 401 when request without access token', async () => {
      // Arrange
      const app = await createServer(container);
      const noteId = '12345678-abcd-abcd-abcd-123456789012';
      const payload = {
        title: 123,
        content: 123,
      };

      // Action
      const response = await request(app).put(`/notes/${noteId}`).send(payload);

      // Assert
      const { message } = response.body.errors;
      expect(response.statusCode).toEqual(401);
      expect(response.body.isSuccess).toEqual(false);
      expect(message).toContain('No token provided');
    });

    it('should return 401 when access token invalid', async () => {
    // Arrange
      const app = await createServer(container);
      const accessToken = 'bearer token';
      const noteId = '12345678-abcd-abcd-abcd-123456789012';
      const payload = {
        title: 123,
        content: 123,
      };

      // Action
      const response = await request(app).put(`/notes/${noteId}`).send(payload).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      const { token } = response.body.errors;
      expect(response.statusCode).toEqual(401);
      expect(response.body.isSuccess).toEqual(false);
      expect(token).toContain('Invalid auth token');
    });

    it('should return 400 when request params not meet data type specification', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken } = await ServerTestHelper.newUser({ request, app }, { username: 'johndoe' });
      const noteId = 'note-123';

      // Action
      const response = await request(app).put(`/notes/${noteId}`).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      const { noteId: idErrors } = response.body.errors;
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(idErrors).toContain('"noteId" must be a valid GUID');
    });

    it('should return 400 when request body not meet data type specification', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken } = await ServerTestHelper.newUser({ request, app }, { username: 'johndoe' });
      const noteId = '12345678-abcd-abcd-abcd-123456789012';
      const payload = {
        title: 123,
        content: 123,
      };

      // Action
      const response = await request(app).put(`/notes/${noteId}`).send(payload).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      const { title, content } = response.body.errors;
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
      expect(title).toContain('"title" must be a string');
      expect(content).toContain('"content" must be a string');
    });

    it('should return 404 when note is not found', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken } = await ServerTestHelper.newUser({ request, app }, { username: 'johndoe' });
      const noteId = '12345678-abcd-abcd-abcd-123456789012';
      const payload = {
        title: 'note 1 updated',
        content: 'note 1 body updated',
      };

      // Action
      const response = await request(app).put(`/notes/${noteId}`).send(payload).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      const { noteId: idErrors } = response.body.errors;
      expect(response.statusCode).toEqual(404);
      expect(response.body.isSuccess).toEqual(false);
      expect(idErrors).toContain('Note not found');
    });

    it('should return 403 when try to update note that\'s not theirs', async () => {
      // Arrange
      const app = await createServer(container);
      const { userId } = await ServerTestHelper.newUser({ request, app }, { username: 'johndoe' });
      const { accessToken } = await ServerTestHelper.newUser({ request, app }, { username: 'foo' });
      const noteId = await NotesTableTestHelper.addNote({
        title: 'note 1', content: 'note 1 body', ownerId: userId,
      });
      const payload = {
        title: 'note 1 updated',
        content: 'note 1 body updated',
      };

      // Action
      const response = await request(app).put(`/notes/${noteId}`).send(payload).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      const { message } = response.body.errors;
      expect(response.statusCode).toEqual(403);
      expect(response.body.isSuccess).toEqual(false);
      expect(message).toContain('You do not have access to this resource');
    });
  });

  describe('when DELETE /notes/{noteId}', () => {
    it('should return 200', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.newUser({ request, app }, { username: 'johndoe' });
      const noteId = await NotesTableTestHelper.addNote({
        title: 'note 1', content: 'note 1 body', ownerId: userId,
      });

      // Action
      const response = await request(app).delete(`/notes/${noteId}`).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.statusCode).toEqual(200);
      expect(response.body.isSuccess).toEqual(true);
      expect(response.body.message).toEqual('Note deleted successfully');
    });

    it('should return 401 when request without access token', async () => {
      // Arrange
      const app = await createServer(container);
      const noteId = '12345678-abcd-abcd-abcd-123456789012';

      // Action
      const response = await request(app).delete(`/notes/${noteId}`);

      // Assert
      const { message } = response.body.errors;
      expect(response.statusCode).toEqual(401);
      expect(response.body.isSuccess).toEqual(false);
      expect(message).toContain('No token provided');
    });

    it('should return 401 when access token invalid', async () => {
      // Arrange
      const app = await createServer(container);
      const accessToken = 'bearer token';
      const noteId = '12345678-abcd-abcd-abcd-123456789012';

      // Action
      const response = await request(app).delete(`/notes/${noteId}`).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      const { token } = response.body.errors;
      expect(response.statusCode).toEqual(401);
      expect(response.body.isSuccess).toEqual(false);
      expect(token).toContain('Invalid auth token');
    });

    it('should return 400 when request params not meet data type specification', async () => {
    // Arrange
      const app = await createServer(container);
      const { accessToken } = await ServerTestHelper.newUser({ request, app }, { username: 'johndoe' });
      const noteId = 'note-123';

      // Action
      const response = await request(app).delete(`/notes/${noteId}`).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.statusCode).toEqual(400);
      expect(response.body.isSuccess).toEqual(false);
    });

    it('should return 404 when note is not found', async () => {
    // Arrange
      const app = await createServer(container);
      const { accessToken } = await ServerTestHelper.newUser({ request, app }, { username: 'johndoe' });
      const noteId = '12345678-abcd-abcd-abcd-123456789012';

      // Action
      const response = await request(app).delete(`/notes/${noteId}`).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      const { noteId: idErrors } = response.body.errors;
      expect(response.statusCode).toEqual(404);
      expect(response.body.isSuccess).toEqual(false);
      expect(idErrors).toContain('Note not found');
    });

    it('should return 403 when try to delete note that\'s not theirs', async () => {
    // Arrange
      const app = await createServer(container);
      const { userId } = await ServerTestHelper.newUser({ request, app }, { username: 'johndoe' });
      const { accessToken } = await ServerTestHelper.newUser({ request, app }, { username: 'foo' });
      const noteId = await NotesTableTestHelper.addNote({
        title: 'note 1', content: 'note 1 body', ownerId: userId,
      });

      // Action
      const response = await request(app).delete(`/notes/${noteId}`).set('Authorization', `Bearer ${accessToken}`);

      // Assert
      const { message } = response.body.errors;
      expect(response.statusCode).toEqual(403);
      expect(response.body.isSuccess).toEqual(false);
      expect(message).toContain('You do not have access to this resource');
    });
  });
});
