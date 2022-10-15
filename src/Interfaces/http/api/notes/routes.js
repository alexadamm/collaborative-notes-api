const { Router } = require('express');
const ServerMiddlewares = require('../../../../Infrastructures/http/middlewares');
const NotesController = require('./controller');

const notes = (container) => {
  const notesRouter = Router();
  const notesController = new NotesController(container);

  notesRouter.post('/', ServerMiddlewares.authenticationHandler, notesController.postNoteController);

  return notesRouter;
};

module.exports = notes;
