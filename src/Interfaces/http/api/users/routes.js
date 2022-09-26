const { Router } = require('express');
const UsersController = require('./controller');

const users = (container) => {
  const userRouter = Router();
  const usersController = new UsersController(container);

  userRouter.post('/', usersController.postUserController);

  return userRouter;
};

module.exports = users;
