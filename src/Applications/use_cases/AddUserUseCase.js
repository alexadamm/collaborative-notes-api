const AddUser = require('../../Domains/users/entities/AddUser');

class AddUserUseCase {
  constructor({ usersService, passwordHasher }) {
    this.usersService = usersService;
    this.passwordHasher = passwordHasher;
  }

  async execute(payload) {
    const addUser = new AddUser(payload);
    await this.usersService.verifyAvailableUsername(addUser.username);
    addUser.password = await this.passwordHasher.hash(addUser.password);
    return this.usersService.addUser(addUser);
  }
}

module.exports = AddUserUseCase;
