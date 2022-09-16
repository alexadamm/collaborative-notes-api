const AddedUser = require('../../../Domains/users/entities/AddedUser');
const AddUser = require('../../../Domains/users/entities/AddUser');
const UsersService = require('../../../Domains/users/UsersService');
const PasswordHasher = require('../../securities/PasswordHasher');
const AddUserUseCase = require('../AddUserUseCase');

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      fullname: 'John Doe',
      username: 'johndoe',
      password: 'secret',
    };

    const expectedAddedUser = new AddedUser({
      id: '12345678-abcd-abcd-abcd-123456789012',
      fullname: 'John Doe',
      username: 'johndoe',
    });

    const mockUsersService = new UsersService();
    const mockPasswordHasher = new PasswordHasher();

    mockUsersService.verifyAvailableUsername = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHasher.hash = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUsersService.addUser = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedUser));

    const addUserUseCase = new AddUserUseCase({
      usersService: mockUsersService,
      passwordHasher: mockPasswordHasher,
    });

    // Action
    const addedUser = await addUserUseCase.execute(useCasePayload);

    // Assert
    expect(addedUser).toStrictEqual(expectedAddedUser);
    expect(mockUsersService.verifyAvailableUsername).toBeCalledWith(useCasePayload.username);
    expect(mockPasswordHasher.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUsersService.addUser).toBeCalledWith(new AddUser({
      ...useCasePayload,
      password: 'encrypted_password',
    }));
  });
});
