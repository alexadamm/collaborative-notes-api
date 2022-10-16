const AddNoteUseCase = require('../../../../Applications/use_cases/AddNoteUseCase');
const GetNoteByIdUseCase = require('../../../../Applications/use_cases/GetNoteByIdUseCase');
const GetNotesByUserIdUseCase = require('../../../../Applications/use_cases/GetNotesByUserIdUseCase');

class NotesController {
  constructor(container) {
    this._container = container;

    this.postNoteController = this.postNoteController.bind(this);
    this.getNotesController = this.getNotesController.bind(this);
    this.getNoteByIdController = this.getNoteByIdController.bind(this);
  }

  async postNoteController(req, res, next) {
    try {
      const { auth: { userId } } = req;
      const payload = req.body;
      const addNoteUseCase = this._container.getInstance(AddNoteUseCase.name);
      const note = await addNoteUseCase.execute(payload, userId);

      res.status(201).send({
        isSuccess: true,
        message: 'Note added successfully',
        data: note,
      });
    } catch (e) {
      next(e);
    }
  }

  async getNotesController(req, res, next) {
    const { auth: { userId } } = req;
    const getNotesByUserIdUseCase = this._container.getInstance(GetNotesByUserIdUseCase.name);
    const notes = await getNotesByUserIdUseCase.execute(userId);

    res.status(200).send({
      isSuccess: true,
      message: 'Notes retrieved successfully',
      data: notes,
    });
  }

  async getNoteByIdController(req, res, next) {
    try {
      const getNoteByIdUseCase = this._container.getInstance(GetNoteByIdUseCase.name);
      const note = await getNoteByIdUseCase.execute(req.params);

      res.status(200).send({
        isSuccess: true,
        message: 'Note retrieved successfully',
        data: note,
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = NotesController;
