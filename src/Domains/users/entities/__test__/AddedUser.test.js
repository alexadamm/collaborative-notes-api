const AddedUser = require('../AddedUser');

describe('AddedUser entity', () => {
  it('should create AddedUser object correctly', () => {
    // Arrange
    const payload = {
      id: '12345678-abcd-abcd-abcd-123456789012',
      username: 'johndoe',
      fullname: 'John Doe',
    };

    // Action
    const addedUser = new AddedUser(payload);

    // Assert
    expect(addedUser.id).toEqual('12345678-abcd-abcd-abcd-123456789012');
    expect(addedUser.username).toEqual('johndoe');
    expect(addedUser.fullname).toEqual('John Doe');
  });
});
