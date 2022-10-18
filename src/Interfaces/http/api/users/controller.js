const AddUserUseCase = require('../../../../Applications/use_cases/AddUserUseCase');
const GetUserByIdUseCase = require('../../../../Applications/use_cases/GetUserByIdUseCase');
const GetUsersByUsernameUseCase = require('../../../../Applications/use_cases/GetUsersByUsernameUseCase');

class UsersController {
  constructor(container) {
    this._container = container;

    this.postUserController = this.postUserController.bind(this);
    this.getUserByUsernameController = this.getUserByUsernameController.bind(this);
    this.getUserByUserIdController = this.getUserByUserIdController.bind(this);
  }

  async postUserController(req, res, next) {
    try {
      const payload = req.body;
      const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
      const addedUser = await addUserUseCase.execute(payload);

      res.status(201).json({
        isSuccess: true,
        message: 'User added successfully',
        data: { addedUser },
      });
    } catch (e) {
      next(e);
    }
  }

  async getUserByUsernameController(req, res, next) {
    const { query } = req;
    const getUsersByUsernameUseCase = this._container.getInstance(GetUsersByUsernameUseCase.name);
    const users = await getUsersByUsernameUseCase.execute(query);

    res.status(200).json({
      isSuccess: true,
      message: 'Users retrieved successfully',
      data: { users },
    });
  }

  async getUserByUserIdController(req, res, next) {
    try {
      const { params } = req;
      const getUserByIdUseCase = this._container.getInstance(GetUserByIdUseCase.name);
      const user = await getUserByIdUseCase.execute(params);

      res.status(200).json({
        isSuccess: true,
        message: 'User retrieved successfully',
        data: { user },
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = UsersController;
