const NotesTableTestHelper = require('../../../../tests/NotesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NoteDetail = require('../../../Domains/notes/entities/NoteDetail');
const NewNote = require('../../../Domains/notes/entities/NewNote');
const pool = require('../../database/postgres/pool');
const NotesServicePrisma = require('../NotesServicePrisma');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const CollaborationsTableTestHelper = require('../../../../tests/CollaborationsTableTestHelper');
const DatabaseTestHelper = require('../../../../tests/DatabaseTestHelper');

describe('NotesServicePrisma', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser(
      { id: '12345678-abcd-abcd-abcd-123456789012', username: 'johndoe' },
    );
  });
  afterEach(async () => {
    await DatabaseTestHelper.cleanTable();
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
    it('should return all notes that owned by the user and collaborated with user', async () => {
      // Arrange
      await UsersTableTestHelper.addUser(
        { id: '12345678-abcd-abcd-abcd-123456789010', username: 'foo' },
      );
      const ownerId = '12345678-abcd-abcd-abcd-123456789012';
      const ownerId2 = '12345678-abcd-abcd-abcd-123456789010';
      const notesServicePrisma = new NotesServicePrisma(pool);
      await NotesTableTestHelper.addNote({ ownerId, title: 'A' });
      await NotesTableTestHelper.addNote({ ownerId, title: 'B' });
      await NotesTableTestHelper.addNote({ ownerId, title: 'C' });
      const noteId = await NotesTableTestHelper.addNote({
        ownerId: ownerId2,
        title: 'D',
      });
      await NotesTableTestHelper.addNote({
        ownerId: ownerId2,
        title: 'E',
      });
      await CollaborationsTableTestHelper.addCollaboration({
        noteId,
        userId: ownerId,
      });

      // Action
      const notes = await notesServicePrisma.getAllNotes(ownerId);

      // Assert
      expect(notes).toHaveLength(4);
    });
  });

  describe('verifyNoteOwner method', () => {
    it('should throw AuthorizationError when the note does not owned by the user', async () => {
      // Arrange
      const noteOwnerId = '12345678-abcd-abcd-abcd-123456789012';
      const userId = '12345678-abcd-abcd-abcd-123456789013';
      const notesServicePrisma = new NotesServicePrisma(pool);
      const noteId = await NotesTableTestHelper.addNote({ ownerId: noteOwnerId });

      // Action & Assert
      await expect(notesServicePrisma.verifyNoteOwner(userId, noteId))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when the note owned by the user', async () => {
      // Arrange
      const noteOwnerId = '12345678-abcd-abcd-abcd-123456789012';
      const notesServicePrisma = new NotesServicePrisma(pool);
      const noteId = await NotesTableTestHelper.addNote({ ownerId: noteOwnerId });

      // Action & Assert
      await expect(notesServicePrisma.verifyNoteOwner(noteOwnerId, noteId))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('updateNote method', () => {
    it('should update note correctly', async () => {
      // Arrange
      const ownerId = '12345678-abcd-abcd-abcd-123456789012';
      const notesServicePrisma = new NotesServicePrisma(pool);
      const noteId = await NotesTableTestHelper.addNote({ ownerId });
      const newNoteDetail = new NoteDetail({
        title: 'Updated note title',
        content: 'lorem ipsum dolor sit amet.',
      });

      // Action
      const updatedNote = await notesServicePrisma.updateNote(noteId, newNoteDetail);

      // Assert
      expect(updatedNote).toBeInstanceOf(NoteDetail);
      expect(updatedNote.title).toEqual(newNoteDetail.title);
      expect(updatedNote.content).toEqual(newNoteDetail.content);
    });
  });

  describe('deleteNoteById method', () => {
    it('should delete note correctly', async () => {
      // Arrange
      const ownerId = '12345678-abcd-abcd-abcd-123456789012';
      const notesServicePrisma = new NotesServicePrisma(pool);
      const noteId = await NotesTableTestHelper.addNote({ ownerId });

      // Action
      await notesServicePrisma.deleteNoteById(noteId);

      // Assert
      const notes = await NotesTableTestHelper.findNoteByOwnerId(ownerId);
      expect(notes).toHaveLength(0);
    });
  });
});
