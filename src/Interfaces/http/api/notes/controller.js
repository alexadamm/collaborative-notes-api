const AddNoteUseCase = require('../../../../Applications/use_cases/AddNoteUseCase');
const DeleteNoteByIdUseCase = require('../../../../Applications/use_cases/DeleteNoteByIdUseCase');
const GetNoteByIdUseCase = require('../../../../Applications/use_cases/GetNoteByIdUseCase');
const GetNotesByUserIdUseCase = require('../../../../Applications/use_cases/GetNotesByUserIdUseCase');
const UpdateNoteUseCase = require('../../../../Applications/use_cases/UpdateNoteUseCase');

class NotesController {
  constructor(container) {
    this._container = container;

    this.postNoteController = this.postNoteController.bind(this);
    this.getNotesController = this.getNotesController.bind(this);
    this.getNoteByIdController = this.getNoteByIdController.bind(this);
    this.putNoteController = this.putNoteController.bind(this);
    this.deleteNoteByIdController = this.deleteNoteByIdController.bind(this);
  }

  async postNoteController(req, res) {
    const { auth: { userId } } = req;
    const payload = req.body;
    const addNoteUseCase = this._container.getInstance(AddNoteUseCase.name);
    const addedNote = await addNoteUseCase.execute(payload, userId);

    res.status(201).send({
      isSuccess: true,
      message: 'Note added successfully',
      data: { addedNote },
    });
  }

  async getNotesController(req, res) {
    const { auth: { userId } } = req;
    const getNotesByUserIdUseCase = this._container.getInstance(GetNotesByUserIdUseCase.name);
    const notes = await getNotesByUserIdUseCase.execute(userId);

    res.status(200).send({
      isSuccess: true,
      message: 'Notes retrieved successfully',
      data: { notes },
    });
  }

  async getNoteByIdController(req, res) {
    const getNoteByIdUseCase = this._container.getInstance(GetNoteByIdUseCase.name);
    const note = await getNoteByIdUseCase.execute(req.params);

    res.status(200).send({
      isSuccess: true,
      message: 'Note retrieved successfully',
      data: { note },
    });
  }

  async putNoteController(req, res) {
    const updateNoteUseCase = this._container.getInstance(UpdateNoteUseCase.name);
    const updatedNote = await updateNoteUseCase.execute(req.body, req.params, req.auth.userId);

    res.status(200).send({
      isSuccess: true,
      message: 'Note updated successfully',
      data: { updatedNote },
    });
  }

  async deleteNoteByIdController(req, res) {
    const deleteNoteByIdUseCase = this._container.getInstance(DeleteNoteByIdUseCase.name);
    await deleteNoteByIdUseCase.execute(req.params, req.auth.userId);

    res.status(200).send({
      isSuccess: true,
      message: 'Note deleted successfully',
    });
  }
}

module.exports = NotesController;
