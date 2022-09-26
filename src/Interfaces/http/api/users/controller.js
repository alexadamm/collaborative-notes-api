const AddUserUseCase = require('../../../../Applications/use_cases/AddUserUseCase');
const GetUsersByUsernameUseCase = require('../../../../Applications/use_cases/GetUsersByUsernameUseCase');

class UsersController {
  constructor(container) {
    this._container = container;

    this.postUserController = this.postUserController.bind(this);
  }

  async postUserController(req, res, next) {
    try {
      const payload = req.body;
      const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
      const user = await addUserUseCase.execute(payload);

      res.status(201).json({
        isSuccess: true,
        message: 'User added successfully',
        data: user,
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = UsersController;
