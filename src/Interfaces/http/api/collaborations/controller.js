const AddCollaborationUseCase = require('../../../../Applications/use_cases/AddCollaborationUseCase');

class CollaborationsController {
  constructor(container) {
    this._container = container;

    this.postCollaborationController = this.postCollaborationController.bind(this);
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
}

module.exports = CollaborationsController;
