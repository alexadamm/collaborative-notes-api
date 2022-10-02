const { Router } = require('express');
const AuthenticationsController = require('./controller');

const authentications = (container) => {
  const authenticationsRouter = Router();
  const authenticationsController = new AuthenticationsController(container);

  authenticationsRouter.post('/', authenticationsController.postAuthenticationController);
  authenticationsRouter.delete('/', authenticationsController.deleteAuthenticationController);

  return authenticationsRouter;
};

module.exports = authentications;
