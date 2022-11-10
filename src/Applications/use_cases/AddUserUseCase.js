const AddUser = require('../../Domains/users/entities/AddUser');

class AddUserUseCase {
  constructor({ usersService, passwordHasher, usersValidator }) {
    this.usersValidator = usersValidator;
    this.usersService = usersService;
    this.passwordHasher = passwordHasher;
  }

  async execute(payload) {
    this.usersValidator.validatePostUserPayload(payload);
    const addUser = new AddUser({
      ...payload,
      username: payload.username.toLowerCase(),
    });
    await this.usersService.verifyAvailableUsername(addUser.username);
    addUser.password = await this.passwordHasher.hash(addUser.password);
    return this.usersService.addUser(addUser);
  }
}

module.exports = AddUserUseCase;
