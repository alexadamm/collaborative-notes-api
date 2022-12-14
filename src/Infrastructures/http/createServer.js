const express = require('express');
const { default: helmet } = require('helmet');
const authentications = require('../../Interfaces/http/api/authentications/routes');

const users = require('../../Interfaces/http/api/users/routes');
const ServerMiddlewares = require('./middlewares');
const notes = require('../../Interfaces/http/api/notes/routes');
const collaborations = require('../../Interfaces/http/api/collaborations/routes');

const createServer = async (container) => {
  const app = express();

  app.use(express.json());
  app.use(helmet());
  app.use(express.urlencoded({ extended: true }));

  app.use('/users', users(container));
  app.use('/authentications', authentications(container));
  app.use('/notes', notes(container));
  app.use('/notes', collaborations(container));

  app.use(ServerMiddlewares.unregisteredRouteHandler);
  app.use(ServerMiddlewares.errorHandler);

  return app;
};

module.exports = createServer;
