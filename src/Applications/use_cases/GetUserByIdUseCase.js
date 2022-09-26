class GetUserByIdUseCase {
  constructor({ usersService, usersValidator }) {
    this.usersService = usersService;
    this.usersValidator = usersValidator;
  }

  async execute(params) {
    this.usersValidator.validateGetUserByIdParams(params);
    const { userId } = params;
    return this.usersService.getUserById(userId);
  }
}

module.exports = GetUserByIdUseCase;
