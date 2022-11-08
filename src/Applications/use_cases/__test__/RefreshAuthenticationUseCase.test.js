const AuthenticationService = require('../../../Domains/authentications/AuthenticationService');
const AuthenticationTokenManager = require('../../securities/AuthenticationTokenManager');
const AuthenticationsValidator = require('../../../Infrastructures/validator/authentication');
const RefreshAuthenticationUseCase = require('../RefreshAuthenticationUseCase');

describe('RefreshAuthenticaitonUseCase', () => {
  it('should orchestrating the refresh token action correctly', async () => {
    // Arrange
    const payload = {
      refreshToken: 'refreshToken',
    };

    const expectedAccessToken = 'accessToken';

    const mockAuthenticationsValidator = AuthenticationsValidator;
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockAuthenticationService = new AuthenticationService();

    mockAuthenticationsValidator.validatePutAuthenticationPayload = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.verifyRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationService.checkTokenAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ username: 'johndoe', id: '12345678-abcd-abcd-abcd-123456789012' }));
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAccessToken));

    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationService: mockAuthenticationService,
      authenticationValidator: mockAuthenticationsValidator,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const accessToken = await refreshAuthenticationUseCase.execute(payload);

    // Assert
    expect(mockAuthenticationTokenManager.verifyRefreshToken)
      .toBeCalledWith(payload.refreshToken);
    expect(mockAuthenticationService.checkTokenAvailability)
      .toBeCalledWith(payload.refreshToken);
    expect(mockAuthenticationTokenManager.decodePayload)
      .toBeCalledWith(payload.refreshToken);
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toBeCalledWith({ username: 'johndoe', id: '12345678-abcd-abcd-abcd-123456789012' });
    expect(accessToken).toEqual('accessToken');
  });
});
