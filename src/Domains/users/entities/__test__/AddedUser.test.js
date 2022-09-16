const AddedUser = require('../AddedUser');

describe('AddedUser entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'abc',
      fullname: 'abc',
    };

    // Action and Assert
    expect(() => new AddedUser(payload)).toThrowError('ADDED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: [],
      fullname: true,
    };

    // Action and Assert
    expect(() => new AddedUser(payload)).toThrowError('ADDED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

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
