const { Router } = require('express');
const ServerMiddlewares = require('../../../../Infrastructures/http/middlewares');
const NotesController = require('./controller');

const notes = (container) => {
  const notesRouter = Router();
  const notesController = new NotesController(container);

  notesRouter.post('/', ServerMiddlewares.authenticationHandler, notesController.postNoteController);
  notesRouter.get('/', ServerMiddlewares.authenticationHandler, notesController.getNotesController);
  notesRouter.get('/:noteId/', ServerMiddlewares.authenticationHandler, notesController.getNoteByIdController);
  notesRouter.put('/:noteId/', ServerMiddlewares.authenticationHandler, notesController.putNoteController);
  notesRouter.delete('/:noteId/', ServerMiddlewares.authenticationHandler, notesController.deleteNoteByIdController);

  return notesRouter;
};

module.exports = notes;
