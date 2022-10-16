const NotesTableTestHelper = require('../../../../__test__/NotesTableTestHelper');
const UsersTableTestHelper = require('../../../../__test__/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NoteDetail = require('../../../Domains/notes/entities/NoteDetail');
const NewNote = require('../../../Domains/notes/entities/NewNote');
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
      const newNote = new NewNote({
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
      const newNote = new NewNote({
        ownerId: '12345678-abcd-abcd-abcd-123456789012',
        title: 'A title',
        content: 'lorem ipsum dolor sit amet',
      });
      const notesServicePrisma = new NotesServicePrisma(pool);

      // Action
      const addedNote = await notesServicePrisma.addNote(newNote);

      // Assert
      expect(addedNote).toBeInstanceOf(NoteDetail);
      expect(addedNote.owner).toEqual('johndoe');
      expect(addedNote.title).toEqual(newNote.title);
      expect(addedNote.content).toEqual(newNote.content);
      expect(addedNote.createdAt).toBeDefined();
      expect(addedNote.updatedAt).toBeDefined();
    });
  });

  describe('getNoteById method', () => {
    it('should return addedNote correctly', async () => {
      // Arrange
      const notesServicePrisma = new NotesServicePrisma(pool);
      const newNote = new NewNote({
        ownerId: '12345678-abcd-abcd-abcd-123456789012',
        title: 'A title',
        content: 'lorem ipsum dolor sit amet',
      });
      const noteId = await NotesTableTestHelper.addNote(newNote);

      // Action
      const addedNote = await notesServicePrisma.getNoteById(noteId);

      // Assert
      expect(addedNote).toBeInstanceOf(NoteDetail);
      expect(addedNote.owner).toEqual('johndoe');
      expect(addedNote.title).toEqual(newNote.title);
      expect(addedNote.content).toEqual(newNote.content);
      expect(addedNote.createdAt).toBeDefined();
      expect(addedNote.updatedAt).toBeDefined();
    });

    it('should return NotFoundError when the note does not exist', async () => {
      // Arrange
      const noteId = '12345678-abcd-abcd-abcd-123456789012';
      const notesServicePrisma = new NotesServicePrisma(pool);

      // Action & Assert
      await expect(notesServicePrisma.getNoteById(noteId)).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getAllNotes method', () => {
    it('should return all notes that owned by the user', async () => {
      // Arrange
      const ownerId = '12345678-abcd-abcd-abcd-123456789012';
      const notesServicePrisma = new NotesServicePrisma(pool);
      await NotesTableTestHelper.addNote({ ownerId, title: 'A' });
      await NotesTableTestHelper.addNote({ ownerId, title: 'B' });
      await NotesTableTestHelper.addNote({ ownerId, title: 'C' });

      // Action
      const notes = await notesServicePrisma.getAllNotes(ownerId);

      // Assert
      expect(notes).toHaveLength(3);
    });
  });
});
