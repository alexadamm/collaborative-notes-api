const AuthenticationError = require('../AuthenticationError');
const ClientError = require('../ClientError');

describe('AuthenticationError', () => {
  it('should create an error correctly', () => {
    const authenticationError = new AuthenticationError('an error occurs');

    expect(authenticationError).toBeInstanceOf(AuthenticationError);
    expect(authenticationError).toBeInstanceOf(ClientError);
    expect(authenticationError).toBeInstanceOf(Error);

    expect(authenticationError.statusCode).toEqual(401);
    expect(authenticationError.message).toEqual('an error occurs');
    expect(authenticationError.name).toEqual('AuthenticationError');
  });
});
