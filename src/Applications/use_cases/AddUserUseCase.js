const AddUser = require('../../Domains/users/entities/AddUser');

class AddUserUseCase {
  constructor({ usersService, passwordHasher }) {
    this.usersService = usersService;
    this.passwordHasher = passwordHasher;
  }

  async execute(payload) {
    const addUser = new AddUser(payload);
    const { username, password, fullname } = addUser;

    const encryptedPassword = await this.passwordHasher.hash(password);
    const id = await this.usersService
      .addUser({ username, password: encryptedPassword, fullname });

    return id;
  }
}

module.exports = AddUserUseCase;
