const CollaborationsTableTestHelper = require('../../../../tests/CollaborationsTableTestHelper');
const DatabaseTestHelper = require('../../../../tests/DatabaseTestHelper');
const NotesTableTestHelper = require('../../../../tests/NotesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CollaborationDetail = require('../../../Domains/collaborations/entities/CollaborationDetail');
const NewCollaboration = require('../../../Domains/collaborations/entities/NewCollaboration');
const pool = require('../../database/postgres/pool');
const CollaborationsServicePrisma = require('../CollaborationsServicePrisma');

describe('CollaborationsServicePrisma', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser(
      { id: '12345678-abcd-abcd-abcd-123456789012', username: 'johndoe' },
    );
    await NotesTableTestHelper.addNote(
      {
        id: '12345678-abcd-abcd-abcd-123456789010', title: 'A title', content: 'lorem ipsum dolor sit amet', ownerId: '12345678-abcd-abcd-abcd-123456789012',
      },
    );
  });

  afterEach(async () => {
    await DatabaseTestHelper.cleanTable();
  });

  describe('addCollaboration method', () => {
    it('should add a collaboration  to the database', async () => {
      // Arrange
      const newCollaboration = new NewCollaboration({
        noteId: '12345678-abcd-abcd-abcd-123456789010',
        userId: '12345678-abcd-abcd-abcd-123456789012',
      });
      const collaborationsService = new CollaborationsServicePrisma(pool);

      // Action
      await collaborationsService.addCollaboration(newCollaboration);

      // Assert
      const addedCollaboration = await CollaborationsTableTestHelper.findCollaborationsByNoteId('12345678-abcd-abcd-abcd-123456789010');
      expect(addedCollaboration).toHaveLength(1);
    });

    it('should return collaboration detail correctly', async () => {
      // Arrange
      const newCollaboration = new NewCollaboration({
        noteId: '12345678-abcd-abcd-abcd-123456789010',
        userId: '12345678-abcd-abcd-abcd-123456789012',
      });
      const collaborationsService = new CollaborationsServicePrisma(pool);

      // Action
      const addedCollaboration = await collaborationsService.addCollaboration(newCollaboration);

      // Assert
      expect(addedCollaboration).toBeInstanceOf(CollaborationDetail);
      expect(addedCollaboration.noteId).toEqual(newCollaboration.noteId);
      expect(addedCollaboration.username).toEqual('johndoe');
    });
  });

  describe('verifyCollaborator method', () => {
    it('should not throw AuthorizationError when collaboration is a collaborator', async () => {
      // Arrange
      const newCollaboration = new NewCollaboration({
        noteId: '12345678-abcd-abcd-abcd-123456789010',
        userId: '12345678-abcd-abcd-abcd-123456789012',
      });
      const collaborationsService = new CollaborationsServicePrisma(pool);
      await CollaborationsTableTestHelper.addCollaboration({ ...newCollaboration });

      // Action & Assert
      await expect(collaborationsService.verifyCollaborator(newCollaboration))
        .resolves.not.toThrow(AuthorizationError);
    });

    it('should throw AuthorizationError when collaboration user isn\'t a collaborator', async () => {
      // Arrange
      const newCollaboration = new NewCollaboration({
        noteId: '12345678-abcd-abcd-abcd-123456789010',
        userId: '12345678-abcd-abcd-abcd-123456789012',
      });
      const collaborationsService = new CollaborationsServicePrisma(pool);

      // Action & Assert
      await expect(collaborationsService.verifyCollaborator(newCollaboration))
        .rejects.toThrow(AuthorizationError);
    });
  });

  describe('getCollaborators method', () => {
    it('should return a list of collaborators correctly', async () => {
      // Arrange
      const user1 = { id: '12345678-abcd-abcd-abcd-123456789011', username: 'foo' };
      const user2 = { id: '12345678-abcd-abcd-abcd-123456789013', username: 'bar' };
      await UsersTableTestHelper.addUser(user1);
      await UsersTableTestHelper.addUser(user2);
      await CollaborationsTableTestHelper.addCollaboration({
        noteId: '12345678-abcd-abcd-abcd-123456789010',
        userId: '12345678-abcd-abcd-abcd-123456789011',
      });
      await CollaborationsTableTestHelper.addCollaboration({
        noteId: '12345678-abcd-abcd-abcd-123456789010',
        userId: '12345678-abcd-abcd-abcd-123456789013',
      });
      const collaborationsService = new CollaborationsServicePrisma(pool);

      // Action
      const collaborators = await collaborationsService.getCollaborators('12345678-abcd-abcd-abcd-123456789010');

      // Assert
      expect(collaborators).toHaveLength(2);
      expect(collaborators).toContainEqual(user1);
      expect(collaborators).toContainEqual(user2);
    });
  });

  describe('getCollaborationId method', () => {
    it('should return collaboration id correctly', async () => {
      // Arrange
      const newCollaboration = new NewCollaboration({
        noteId: '12345678-abcd-abcd-abcd-123456789010',
        userId: '12345678-abcd-abcd-abcd-123456789012',
      });
      const id = '12345678-abcd-abcd-abcd-123456789009';
      const collaborationsService = new CollaborationsServicePrisma(pool);
      await CollaborationsTableTestHelper.addCollaboration({ id, ...newCollaboration });

      // Action
      const collaborationId = await collaborationsService.getCollaborationId(newCollaboration);

      // Assert
      expect(collaborationId).toEqual(id);
    });

    it('should throw NotFoundError when collaboration not found', async () => {
      // Arrange
      const newCollaboration = new NewCollaboration({
        noteId: '12345678-abcd-abcd-abcd-123456789010',
        userId: '12345678-abcd-abcd-abcd-123456789012',
      });
      const collaborationsService = new CollaborationsServicePrisma(pool);

      // Action & Assert
      await expect(collaborationsService.getCollaborationId(newCollaboration))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteCollaborationById method', () => {
    it('should delete collaboration by id from database', async () => {
      // Arrange
      const newCollaboration = new NewCollaboration({
        noteId: '12345678-abcd-abcd-abcd-123456789010',
        userId: '12345678-abcd-abcd-abcd-123456789012',
      });
      const id = '12345678-abcd-abcd-abcd-123456789009';
      const collaborationsService = new CollaborationsServicePrisma(pool);
      await CollaborationsTableTestHelper.addCollaboration({ id, ...newCollaboration });

      // Action
      await collaborationsService.deleteCollaborationById(id);

      // Assert
      const deletedCollaboration = await CollaborationsTableTestHelper.findCollaborationsByNoteId('12345678-abcd-abcd-abcd-123456789010');
      expect(deletedCollaboration).toHaveLength(0);
    });
  });
});
