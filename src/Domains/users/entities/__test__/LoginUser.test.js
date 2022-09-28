const LoginUser = require('../LoginUser');

describe('LoginUser entity', () => {
  it('should create LoginUser object correctly', () => {
    // Arrange
    const payload = {
      username: 'johndoe',
      password: 'password',
    };

    // Action
    const loginUser = new LoginUser(payload);

    // Assert
    expect(loginUser.username).toEqual(payload.username);
    expect(loginUser.password).toEqual(payload.password);
  });
});
