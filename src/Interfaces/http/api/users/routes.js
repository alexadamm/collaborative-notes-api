const { Router } = require('express');
const UsersController = require('./controller');

const users = (container) => {
  const usersRouter = Router();
  const usersController = new UsersController(container);

  usersRouter.post('/', usersController.postUserController);
  usersRouter.get('/', usersController.getUserByUsernameController);
  usersRouter.get('/:userId', usersController.getUserByUserIdController);

  return usersRouter;
};

module.exports = users;
