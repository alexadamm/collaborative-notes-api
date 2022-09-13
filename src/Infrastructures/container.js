const { createContainer } = require('instances-container');
const PasswordHasher = require('../Applications/securities/PasswordHasher');
const UsersService = require('../Domains/users/UsersService');
const AddUserUseCase = require('../Applications/use_cases/AddUserUseCase');

// creating container
const container = createContainer();

// registering services and repositories
container.register([
  {
    key: UsersService.name,
    Class: {},
    parameter: {},
  },
  {
    key: PasswordHasher.name,
    Class: {},
    parameter: {},
  },
]);

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'usersService',
          internal: UsersService.name,
        },
        {
          name: 'passwordHasher',
          internal: PasswordHasher.name,
        },
      ],
    },
  },
]);

module.exports = container;
