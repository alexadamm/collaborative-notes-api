const AddedUser = require('../../../Domains/users/entities/AddedUser');
const UsersService = require('../../../Domains/users/UsersService');
const UsersValidator = require('../../../Infrastructures/validator/users');
const GetUserByIdUseCase = require('../GetUserByIdUseCase');

describe('GetUserByIdUseCase', () => {
  it('should orchestratrating get user by user id action correctly', async () => {
    // Arrange
    const params = {
      userId: '12345678-abcd-abcd-abcd-123456789012',
    };

    const expectedUser = new AddedUser({
      id: '12345678-abcd-abcd-abcd-123456789012',
      username: 'johndoe',
      fullname: 'John Doe',
    });

    const mockUsersValidator = UsersValidator;
    const mockUsersService = new UsersService();

    mockUsersValidator.validateGetUserByIdParams = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUsersService.getUserById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedUser));

    const getUserByIdUseCase = new GetUserByIdUseCase(
      { usersService: mockUsersService, usersValidator: mockUsersValidator },
    );

    // Action
    const user = await getUserByIdUseCase.execute(params);

    // Assert
    expect(user).toStrictEqual(expectedUser);
    expect(mockUsersValidator.validateGetUserByIdParams).toBeCalledWith(params);
    expect(mockUsersService.getUserById).toBeCalledWith(params.userId);
  });
});
