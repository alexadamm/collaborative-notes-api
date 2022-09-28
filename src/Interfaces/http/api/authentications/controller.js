const LoginUserUseCase = require('../../../../Applications/use_cases/LoginUserUseCase');

class AuthenticationsController {
  constructor(container) {
    this._container = container;

    this.postAuthenticationController = this.postAuthenticationController.bind(this);
  }

  async postAuthenticationController(req, res, next) {
    try {
      const payload = req.body;
      const loginUserUseCase = this._container.getInstance(LoginUserUseCase.name);
      const authentication = await loginUserUseCase.execute(payload);

      res.status(201).json({
        isSuccess: true,
        message: 'Authentication added successfully',
        data: authentication,
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = AuthenticationsController;
