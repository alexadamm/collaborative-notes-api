const { createContainer } = require('instances-container');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const PasswordHasher = require('../Applications/securities/PasswordHasher');
const UsersService = require('../Domains/users/UsersService');
const AddUserUseCase = require('../Applications/use_cases/AddUserUseCase');
const UsersServicePrisma = require('./services/UsersServicePrisma');
const pool = require('./database/postgres/pool');
const PasswordhHasherArgon = require('./securities/PasswordHasherArgon');
const GetUsersByUsernameUseCase = require('../Applications/use_cases/GetUsersByUsernameUseCase');
const UsersValidator = require('./validator/users');
const GetUserByIdUseCase = require('../Applications/use_cases/GetUserByIdUseCase');
const AuthenticationTokenManager = require('../Applications/securities/AuthenticationTokenManager');
const AuthenticationTokenManagerJwt = require('./securities/AuthenticationTokenManagerJwt');

// creating container
const container = createContainer();

// registering services
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
  {
    key: AuthenticationTokenManager.name,
    Class: AuthenticationTokenManagerJwt,
    parameter: {
      dependencies: [
        {
          concrete: jwt,
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
  {
    key: GetUsersByUsernameUseCase.name,
    Class: GetUsersByUsernameUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'usersService',
          internal: UsersService.name,
        },
      ],
    },
  },
  {
    key: GetUserByIdUseCase.name,
    Class: GetUserByIdUseCase,
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
      ],
    },
  },
]);

module.exports = container;
