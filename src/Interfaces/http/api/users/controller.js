const AddUserUseCase = require('../../../../Applications/use_cases/AddUserUseCase');
const container = require('../../../../Infrastructures/container');

class UsersController {
  async postUserController(req, res, next) {
    try {
      const payload = req.body;
      const addUserUseCase = container.getInstance(AddUserUseCase.name);
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
