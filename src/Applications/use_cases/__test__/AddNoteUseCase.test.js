const AddedNote = require('../../../Domains/notes/entities/AddedNote');
const AddNote = require('../../../Domains/notes/entities/AddNote');
const NotesService = require('../../../Domains/notes/NotesService');
const UsersService = require('../../../Domains/users/UsersService');
const NotesValidator = require('../../../Infrastructures/validator/notes');
const AuthenticationTokenManager = require('../../securities/AuthenticationTokenManager');
const AddNoteUseCase = require('../AddNoteUseCase');

describe('AddNoteUseCase', () => {
  it('should orchestrating the add note action correctly', async () => {
    // Arrange
    const payload = {
      title: 'Note Title',
      content: 'lorem ipsum',
    };
    const userId = '12345678-user-abcd-abcd-123456789012';
    const expectedAddedNote = new AddedNote({
      ...payload,
      id: '12345678-note-abcd-abcd-123456789012',
      ownerId: userId,
      updatedAt: '11-09-2001',
    });

    const mockNotesValidator = NotesValidator;
    const mockNotesService = new NotesService();

    mockNotesValidator.validatePostNotePayload = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockNotesService.addNote = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedNote));

    const addNoteUseCase = new AddNoteUseCase({
      notesValidator: mockNotesValidator,
      notesService: mockNotesService,
    });

    // Action
    const addedNote = await addNoteUseCase.execute(payload, userId);

    // Assert
    expect(addedNote).toStrictEqual(expectedAddedNote);
    expect(mockNotesValidator.validatePostNotePayload).toBeCalledWith(payload);
    expect(mockNotesService.addNote).toBeCalledWith(new AddNote(
      {
        ownerId: userId,
        title: payload.title,
        content: payload.content,
      },
    ));
  });
});
