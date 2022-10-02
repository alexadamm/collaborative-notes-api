const AuthenticationService = require('../../../Domains/authentications/AuthenticationService');
const AuthenticationValidator = require('../../../Infrastructures/validator/authentication');
const LogoutUserUseCase = require('../LogoutUserUseCase');

describe('LogoutUserUseCase', () => {
  it('should orchestrating the logout action correctly', async () => {
    // Arrange
    const payload = {
      refreshToken: 'refresh_token',
    };

    const mockAuthenticationValidator = AuthenticationValidator;
    const mockAuthenticationService = new AuthenticationService();
    mockAuthenticationValidator.validateDeleteAuthenticationPayload = jest.fn()
      .mockReturnValue(() => Promise.resolve());
    mockAuthenticationService.checkTokenAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationService.deleteToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationValidator: mockAuthenticationValidator,
      authenticationService: mockAuthenticationService,
    });

    // Action
    await logoutUserUseCase.execute(payload);

    // Assert
    expect(mockAuthenticationValidator.validateDeleteAuthenticationPayload)
      .toHaveBeenCalledWith(payload);
    expect(mockAuthenticationService.checkTokenAvailability)
      .toHaveBeenCalledWith(payload.refreshToken);
    expect(mockAuthenticationService.deleteToken)
      .toHaveBeenCalledWith(payload.refreshToken);
  });
});
