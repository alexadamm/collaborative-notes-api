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
const AuthenticationService = require('../Domains/authentications/AuthenticationService');
const AuthenticationServicePrisma = require('./services/AuthenticationServicePrisma');
const LoginUserUseCase = require('../Applications/use_cases/LoginUserUseCase');
const AuthenticationValidator = require('./validator/authentication');
const LogoutUserUseCase = require('../Applications/use_cases/LogoutUserUseCase');
const NotesService = require('../Domains/notes/NotesService');
const NotesServicePrisma = require('./services/NotesServicePrisma');
const AddNoteUseCase = require('../Applications/use_cases/AddNoteUseCase');
const NotesValidator = require('./validator/notes');
const GetNoteByIdUseCase = require('../Applications/use_cases/GetNoteByIdUseCase');
const GetNotesByUserIdUseCase = require('../Applications/use_cases/GetNotesByUserIdUseCase');
const UpdateNoteUseCase = require('../Applications/use_cases/UpdateNoteUseCase');
const DeleteNoteByIdUseCase = require('../Applications/use_cases/DeleteNoteByIdUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_cases/RefreshAuthenticationUseCase');
const AddCollaborationUseCase = require('../Applications/use_cases/AddCollaborationUseCase');
const CollaborationsService = require('../Domains/collaborations/CollaborationsService');
const CollaborationsServicePrisma = require('./services/CollaborationsServicePrisma');
const CollaborationsValidator = require('./validator/collaborations');
const DeleteCollaborationUseCase = require('../Applications/use_cases/DeleteCollaborationUseCase');

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

    key: AuthenticationService.name,
    Class: AuthenticationServicePrisma,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: NotesService.name,
    Class: NotesServicePrisma,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: CollaborationsService.name,
    Class: CollaborationsServicePrisma,
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
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationsValidator',
          concrete: AuthenticationValidator,
        },
        {
          name: 'usersService',
          internal: UsersService.name,
        },
        {
          name: 'passwordHasher',
          internal: PasswordHasher.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
        {
          name: 'authenticationService',
          internal: AuthenticationService.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationValidator',
          concrete: AuthenticationValidator,
        },
        {
          name: 'authenticationService',
          internal: AuthenticationService.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationValidator',
          concrete: AuthenticationValidator,
        },
        {
          name: 'authenticationService',
          internal: AuthenticationService.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: AddNoteUseCase.name,
    Class: AddNoteUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'notesValidator',
          concrete: NotesValidator,
        },
        {
          name: 'notesService',
          internal: NotesService.name,
        },
      ],
    },
  },
  {
    key: GetNoteByIdUseCase.name,
    Class: GetNoteByIdUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'notesService',
          internal: NotesService.name,
        },
        {
          name: 'notesValidator',
          concrete: NotesValidator,
        },
        {
          name: 'collaborationsService',
          internal: CollaborationsService.name,
        },
      ],
    },
  },
  {
    key: GetNotesByUserIdUseCase.name,
    Class: GetNotesByUserIdUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'notesService',
          internal: NotesService.name,
        },
      ],
    },
  },
  {
    key: UpdateNoteUseCase.name,
    Class: UpdateNoteUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'notesValidator',
          concrete: NotesValidator,
        },
        {
          name: 'notesService',
          internal: NotesService.name,
        },
        {
          name: 'collaborationsService',
          internal: CollaborationsService.name,
        },
      ],
    },
  },
  {
    key: DeleteNoteByIdUseCase.name,
    Class: DeleteNoteByIdUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'notesValidator',
          concrete: NotesValidator,
        },
        {
          name: 'notesService',
          internal: NotesService.name,
        },
      ],
    },
  },
  {
    key: AddCollaborationUseCase.name,
    Class: AddCollaborationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'usersService',
          internal: UsersService.name,
        },
        {
          name: 'collaborationsValidator',
          concrete: CollaborationsValidator,
        },
        {
          name: 'notesService',
          internal: NotesService.name,
        },
        {
          name: 'collaborationsService',
          internal: CollaborationsService.name,
        },
      ],
    },
  },
  {
    key: DeleteCollaborationUseCase.name,
    Class: DeleteCollaborationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'usersService',
          internal: UsersService.name,
        },
        {
          name: 'collaborationsValidator',
          concrete: CollaborationsValidator,
        },
        {
          name: 'notesService',
          internal: NotesService.name,
        },
        {
          name: 'collaborationsService',
          internal: CollaborationsService.name,
        },
      ],
    },
  },
]);

module.exports = container;
