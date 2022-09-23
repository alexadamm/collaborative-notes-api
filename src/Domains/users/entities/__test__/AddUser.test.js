const AddUser = require('../AddUser');

describe('AddUser entitiy', () => {
  it('should create AddUser object correctly', async () => {
    // Arrange
    const payload = new AddUser({
      username: 'johndoe',
      password: 'secret',
      fullname: 'John Doe',
    });

    // Action
    const { username, password, fullname } = new AddUser(payload);

    // Assert
    expect(username).toEqual('johndoe');
    expect(password).toEqual('secret');
    expect(fullname).toEqual('John Doe');
  });
});
