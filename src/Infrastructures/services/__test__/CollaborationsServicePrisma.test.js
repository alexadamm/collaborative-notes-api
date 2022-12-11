const CollaborationsTableTestHelper = require('../../../../tests/CollaborationsTableTestHelper');
const DatabaseTestHelper = require('../../../../tests/DatabaseTestHelper');
const NotesTableTestHelper = require('../../../../tests/NotesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
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
});
