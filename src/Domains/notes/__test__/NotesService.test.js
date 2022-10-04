const NotesService = require('../NotesService');

describe('NotesService interface', () => {
  it('should throw error when invoke unimplemeneted function', () => {
    const notesService = new NotesService();

    expect(notesService.addNote({})).rejects.toThrowError('NOTES_SERVICE.METHOD_NOT_IMPLEMENTED');
    expect(notesService.getAllNotes()).rejects.toThrowError('NOTES_SERVICE.METHOD_NOT_IMPLEMENTED');
    expect(notesService.getNoteById('')).rejects.toThrowError('NOTES_SERVICE.METHOD_NOT_IMPLEMENTED');
    expect(notesService.updateNote({})).rejects.toThrowError('NOTES_SERVICE.METHOD_NOT_IMPLEMENTED');
    expect(notesService.deleteNoteById('')).rejects.toThrowError('NOTES_SERVICE.METHOD_NOT_IMPLEMENTED');
  });
});
