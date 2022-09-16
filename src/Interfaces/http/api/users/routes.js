const { Router } = require('express');
const UsersController = require('./controller');

const userRouter = Router();
const usersController = new UsersController();

userRouter.post('/', usersController.postUserController);

module.exports = userRouter;
