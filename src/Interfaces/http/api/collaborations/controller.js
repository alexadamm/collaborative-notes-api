const AddCollaborationUseCase = require('../../../../Applications/use_cases/AddCollaborationUseCase');
const DeleteCollaborationUseCase = require('../../../../Applications/use_cases/DeleteCollaborationUseCase');

class CollaborationsController {
  constructor(container) {
    this._container = container;

    this.postCollaborationController = this.postCollaborationController.bind(this);
    this.deleteCollaborationController = this.deleteCollaborationController.bind(this);
  }

  async postCollaborationController(req, res) {
    const { auth: { userId } } = req;
    const addCollaborationUseCase = this._container
      .getInstance(AddCollaborationUseCase.name);
    const addedCollaboration = await addCollaborationUseCase
      .execute(req.params, req.body, userId);

    res.status(201).send({
      isSuccess: true,
      message: 'Collaboration added successfully',
      data: { addedCollaboration },
    });
  }

  async deleteCollaborationController(req, res) {
    const { auth: { userId } } = req;
    const deleteCollaborationUseCase = this._container
      .getInstance(DeleteCollaborationUseCase.name);
    await deleteCollaborationUseCase
      .execute(req.params, req.body, userId);

    res.status(200).send({
      isSuccess: true,
      message: 'Collaboration deleted successfully',
    });
  }
}

module.exports = CollaborationsController;
