class GetUsersByUsernameUseCase {
  constructor({ usersService }) {
    this.usersService = usersService;
  }

  async execute(query) {
    const { username = '' } = query;
    return this.usersService.getUsersByUsername(username);
  }
}

module.exports = GetUsersByUsernameUseCase;
