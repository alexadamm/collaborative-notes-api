const AuthenticationService = require('../AuthenticationService');

describe('AuthenticationService interface', () => {
  it('should throw error when invoke unimplemented function', async () => {
    // Arrange
    const authenticationService = new AuthenticationService();

    // Action and  Assert
    expect(authenticationService.addToken).rejects.toThrowError('AUTHENTICATION_SERVICE.METHOD_NOT_IMPLEMENTED');
    expect(authenticationService.checkTokenAvailability).rejects.toThrowError('AUTHENTICATION_SERVICE.METHOD_NOT_IMPLEMENTED');
    expect(authenticationService.deleteToken).rejects.toThrowError('AUTHENTICATION_SERVICE.METHOD_NOT_IMPLEMENTED');
  });
});
