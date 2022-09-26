const AddedUser = require('../../../Domains/users/entities/AddedUser');
const UsersService = require('../../../Domains/users/UsersService');
const GetUsersByUsernameUseCase = require('../GetUsersByUsernameUseCase');

describe('GetUsersByUsernameUseCase', () => {
  it('should orchestrating get users by username action correctly', async () => {
    // Arrange
    const query = {
      username: 'johnd',
    };

    const expectedUsers = [
      new AddedUser({
        id: '12345678-abcd-abcd-abcd-123456789012',
        username: 'johndoe',
        fullname: 'John Doe',
      }),
    ];

    const mockUsersService = new UsersService();

    mockUsersService.getUsersByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedUsers));

    const getUsersByUsernameUseCase = new GetUsersByUsernameUseCase({
      usersService: mockUsersService,
    });

    // Action
    const users = await getUsersByUsernameUseCase.execute(query);

    // Assert
    expect(users).toStrictEqual(expectedUsers);
    expect(mockUsersService.getUsersByUsername).toBeCalledWith(query.username);
  });
});
