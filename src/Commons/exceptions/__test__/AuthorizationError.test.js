const AuthorizationError = require('../AuthorizationError');
const ClientError = require('../ClientError');

describe('AuthorizationError', () => {
  it('should create an error correctly', () => {
    const authorizationError = new AuthorizationError('an error occurs');

    expect(authorizationError).toBeInstanceOf(AuthorizationError);
    expect(authorizationError).toBeInstanceOf(ClientError);
    expect(authorizationError).toBeInstanceOf(Error);

    expect(authorizationError.statusCode).toEqual(403);
    expect(authorizationError.message).toEqual('an error occurs');
    expect(authorizationError.name).toEqual('AuthorizationError');
  });
});
