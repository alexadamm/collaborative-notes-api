const AuthenticationTokenManager = require('../AuthenticationTokenManager');

describe('AuthenticationTokenManager interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const authenticationTokenManager = new AuthenticationTokenManager();

    // Action and Assert
    expect(authenticationTokenManager.createAccessToken).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    expect(authenticationTokenManager.createRefreshToken).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    expect(authenticationTokenManager.verifyRefreshToken).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    expect(authenticationTokenManager.decodePayload).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER');
  });
});
