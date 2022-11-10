const NewAuth = require('../../Domains/authentications/entities/NewAuth');

class LoginUserUseCase {
  constructor({
    authenticationsValidator,
    usersService,
    passwordHasher,
    authenticationTokenManager,
    authenticationService,
  }) {
    this.authenticationsValidator = authenticationsValidator;
    this.usersService = usersService;
    this.passwordHasher = passwordHasher;
    this.authenticationTokenManager = authenticationTokenManager;
    this.authenticationService = authenticationService;
  }

  async execute(payload) {
    this.authenticationsValidator.validatePostAuthenticationPayload(payload);

    const { username, password } = payload;

    const encryptedPassword = await this.usersService.getPasswordByUsername(username.toLowerCase());
    await this.passwordHasher.compare(password, encryptedPassword);

    const id = await this.usersService.getIdByUsername(username.toLowerCase());

    const accessToken = await this.authenticationTokenManager
      .createAccessToken({ id, username: username.toLowerCase() });
    const refreshToken = await this.authenticationTokenManager
      .createRefreshToken({ id, username: username.toLowerCase() });

    await this.authenticationService.addToken(refreshToken);

    return new NewAuth({ accessToken, refreshToken });
  }
}

module.exports = LoginUserUseCase;
