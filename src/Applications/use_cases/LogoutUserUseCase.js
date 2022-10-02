class LogoutUserUseCase {
  constructor({ authenticationValidator, authenticationService }) {
    this.authenticationValidator = authenticationValidator;
    this.authenticationService = authenticationService;
  }

  async execute(payload) {
    this.authenticationValidator.validateDeleteAuthenticationPayload(payload);
    const { refreshToken } = payload;
    await this.authenticationService.checkTokenAvailability(refreshToken);
    await this.authenticationService.deleteToken(refreshToken);
  }
}

module.exports = LogoutUserUseCase;
