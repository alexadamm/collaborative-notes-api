const NotesTableTestHelper = require('../../../../__test__/NotesTableTestHelper');
const UsersTableTestHelper = require('../../../../__test__/UsersTableTestHelper');
const AddedNote = require('../../../Domains/notes/entities/AddedNote');
const AddNote = require('../../../Domains/notes/entities/AddNote');
const pool = require('../../database/postgres/pool');
const NotesServicePrisma = require('../NotesServicePrisma');

describe('NotesServicePrisma', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser(
      { id: '12345678-abcd-abcd-abcd-123456789012', username: 'johndoe' },
    );
  });
  afterEach(async () => {
    await NotesTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  describe('addNote method', () => {
    it('should add note to the database', async () => {
      // Arrange
      const newNote = new AddNote({
        ownerId: '12345678-abcd-abcd-abcd-123456789012',
        title: 'A title',
        content: 'lorem ipsum dolor sit amet',
      });
      const notesServicePrisma = new NotesServicePrisma(pool);

      // Action
      await notesServicePrisma.addNote(newNote);

      // Assert
      const addedNotes = await NotesTableTestHelper.findNoteByOwnerId('12345678-abcd-abcd-abcd-123456789012');
      expect(addedNotes).toHaveLength(1);
    });

    it('should return addedNote correctly', async () => {
      // Arrange
      const newNote = new AddNote({
        ownerId: '12345678-abcd-abcd-abcd-123456789012',
        title: 'A title',
        content: 'lorem ipsum dolor sit amet',
      });
      const notesServicePrisma = new NotesServicePrisma(pool);

      // Action
      const addedNote = await notesServicePrisma.addNote(newNote);

      // Assert
      expect(addedNote).toBeInstanceOf(AddedNote);
      expect(addedNote.ownerId).toEqual(newNote.ownerId);
      expect(addedNote.title).toEqual(newNote.title);
      expect(addedNote.content).toEqual(newNote.content);
      expect(addedNote.createdAt).toBeDefined();
      expect(addedNote.updatedAt).toBeDefined();
    });
  });
});
