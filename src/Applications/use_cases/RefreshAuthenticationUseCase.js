class RefreshAuthenticationUseCase {
  constructor({
    authenticationService,
    authenticationTokenManager,
    authenticationValidator,
  }) {
    this.authenticationService = authenticationService;
    this.authenticationTokenManager = authenticationTokenManager;
    this.authenticationValidator = authenticationValidator;
  }

  async execute(payload) {
    this.authenticationValidator.validatePutAuthenticationPayload(payload);
    const { refreshToken } = payload;

    await this.authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this.authenticationService.checkTokenAvailability(refreshToken);

    const { username, id } = await this.authenticationTokenManager.decodePayload(refreshToken);

    return this.authenticationTokenManager.createAccessToken({ username, id });
  }
}

module.exports = RefreshAuthenticationUseCase;
