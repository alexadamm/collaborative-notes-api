const { createContainer } = require('instances-container');
const argon2 = require('argon2');

const PasswordHasher = require('../Applications/securities/PasswordHasher');
const UsersService = require('../Domains/users/UsersService');
const AddUserUseCase = require('../Applications/use_cases/AddUserUseCase');
const UsersServicePrisma = require('./services/UsersServicePrisma');
const pool = require('./database/postgres/pool');
const PasswordhHasherArgon = require('./securities/PasswordHasherArgon');
const UsersValidator = require('./validator/users');

// creating container
const container = createContainer();

// registering services and repositories
container.register([
  {
    key: UsersService.name,
    Class: UsersServicePrisma,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: PasswordHasher.name,
    Class: PasswordhHasherArgon,
    parameter: {
      dependencies: [
        {
          concrete: argon2,
        },
      ],
    },
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
          name: 'usersValidator',
          concrete: UsersValidator,
        },
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
