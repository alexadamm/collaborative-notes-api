const UsersService = require('../UsersService');

describe('UsersService interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const usersService = new UsersService();

    // Action and Assert
    expect(usersService.verifyAvailableUsername('')).rejects.toThrowError('USERS_SERVICE.METHOD_NOT_IMPLEMENTED');
    expect(usersService.createUser({})).rejects.toThrowError('USERS_SERVICE.METHOD_NOT_IMPLEMENTED');
    expect(usersService.readUsers()).rejects.toThrowError('USERS_SERVICE.METHOD_NOT_IMPLEMENTED');
    expect(usersService.readUserById('')).rejects.toThrowError('USERS_SERVICE.METHOD_NOT_IMPLEMENTED');
  });
});
