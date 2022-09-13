const AddUser = require('../AddUser');

describe('AddUser entitiy', () => {
  it('should throw error when payload not contain needed property', async () => {
    // Arrange
    const payload = {
      username: 'abc',
      fullname: 'abc',
    };

    // Action and Assert
    expect(() => new AddUser(payload)).toThrowError('ADD_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    // Arrange
    const payload = {
      username: 123,
      password: 'abdc',
      fullname: true,
    };

    // Action and Assert
    expect(() => new AddUser(payload)).toThrowError('ADD_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when length of username is more than 50', () => {
    // Arrange
    const payload = {
      username: 'abc'.repeat(50),
      password: 'abc',
      fullname: 'abc',
    };

    // Action and Assert
    expect(() => new AddUser(payload)).toThrowError('ADD_USER.USERNAME_LIMIT_CHAR');
  });

  it('should throw error when username contain restricted character', () => {
    // Arrange
    const payload = {
      username: 'abc!',
      password: 'abc',
      fullname: 'abc',
    };

    // Action and Assert
    expect(() => new AddUser(payload)).toThrowError('ADD_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
  });

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
