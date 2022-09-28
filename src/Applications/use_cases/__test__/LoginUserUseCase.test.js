const AuthenticationService = require('../../../Domains/authentications/AuthenticationService');
const NewAuth = require('../../../Domains/authentications/entities/NewAuth');
const LoginUser = require('../../../Domains/users/entities/LoginUser');
const UsersService = require('../../../Domains/users/UsersService');
const PasswordHasher = require('../../securities/PasswordHasher');
const AuthenticationTokenManager = require('../../securities/AuthenticationTokenManager');
const AuthenticationValidator = require('../../../Infrastructures/validator/authentication');
const AddedUser = require('../../../Domains/users/entities/AddedUser');
const LoginUserUseCase = require('../LoginUserUseCase');

describe('LoginUserUseCase', () => {
  it('should orchestrating the login action correctly', async () => {
    const payload = new LoginUser({
      username: 'johndoe',
      password: 'password',
    });

    const userId = '12345678-abcd-abcd-abcd-123456789012';
    const encryptedPassword = 'encrypted_password';

    const expectedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    const mockAuthenticationValidator = AuthenticationValidator;
    const mockUsersService = new UsersService();
    const mockPasswordHasher = new PasswordHasher();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockAuthenticationService = new AuthenticationService();

    mockAuthenticationValidator.validatePostAuthenticationPayload = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUsersService.getPasswordByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(encryptedPassword));
    mockPasswordHasher.compare = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUsersService.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(userId));
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAuthentication.accessToken));
    mockAuthenticationTokenManager.createRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAuthentication.refreshToken));
    mockAuthenticationService.addToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const loginUserUseCase = new LoginUserUseCase({
      authenticationsValidator: mockAuthenticationValidator,
      usersService: mockUsersService,
      passwordHasher: mockPasswordHasher,
      authenticationTokenManager: mockAuthenticationTokenManager,
      authenticationService: mockAuthenticationService,
    });

    // Action
    const authentication = await loginUserUseCase.execute(payload);

    // Assert
    expect(authentication).toStrictEqual(expectedAuthentication);
    expect(mockAuthenticationValidator.validatePostAuthenticationPayload).toBeCalledWith(payload);
    expect(mockUsersService.getPasswordByUsername).toBeCalledWith(payload.username);
    expect(mockPasswordHasher.compare).toBeCalledWith(payload.password, encryptedPassword);
    expect(mockUsersService.getIdByUsername).toBeCalledWith(payload.username);
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toBeCalledWith({ id: userId, username: payload.username });
    expect(mockAuthenticationTokenManager.createRefreshToken)
      .toBeCalledWith({ id: userId, username: payload.username });
    expect(mockAuthenticationService.addToken).toBeCalledWith(expectedAuthentication.refreshToken);
  });
});
