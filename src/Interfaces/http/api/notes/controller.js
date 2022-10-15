const AddNoteUseCase = require('../../../../Applications/use_cases/AddNoteUseCase');

class NotesController {
  constructor(container) {
    this._container = container;

    this.postNoteController = this.postNoteController.bind(this);
  }

  async postNoteController(req, res, next) {
    try {
      const { token } = req;
      const payload = req.body;
      const addNoteUseCase = this._container.getInstance(AddNoteUseCase.name);
      const note = await addNoteUseCase.execute(payload, token);

      res.status(201).send({
        isSuccess: true,
        message: 'Note added successfully',
        data: note,
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = NotesController;
