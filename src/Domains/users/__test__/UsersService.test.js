const UsersService = require('../UsersService');

describe('UsersService interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const usersService = new UsersService();

    // Action and Assert
    expect(usersService.verifyAvailableUsername('')).rejects.toThrowError('USERS_SERVICE.METHOD_NOT_IMPLEMENTED');
    expect(usersService.addUser({})).rejects.toThrowError('USERS_SERVICE.METHOD_NOT_IMPLEMENTED');
    expect(usersService.getUsersByUsername('username')).rejects.toThrowError('USERS_SERVICE.METHOD_NOT_IMPLEMENTED');
    expect(usersService.getUserById('id')).rejects.toThrowError('USERS_SERVICE.METHOD_NOT_IMPLEMENTED');
  });
});
