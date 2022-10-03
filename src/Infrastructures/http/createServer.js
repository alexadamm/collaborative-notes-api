const express = require('express');
const { default: helmet } = require('helmet');
const ClientError = require('../../Commons/exceptions/ClientError');
const authentications = require('../../Interfaces/http/api/authentications/routes');

const users = require('../../Interfaces/http/api/users/routes');

const createServer = async (container) => {
  const app = express();

  app.use(express.json());
  app.use(helmet());
  app.use(express.urlencoded({ extended: true }));

  app.use('/users', users(container));
  app.use('/authentications', authentications(container));

  // Error handler
  app.use((req, res) => {
    res.status(404).send({
      isSuccess: false,
      status: 'NOT_FOUND',
      errors: { message: 'Page not found' },
    });
  });

  app.use((err, req, res, next) => {
    if (err instanceof ClientError) {
      return res.status(err.statusCode).send({
        isSuccess: false,
        status: err.status,
        errors: err.errors,
      });
    }
    return res.status(500).send({
      isSuccess: false,
      status: 'INTERNAL_SERVER_ERROR',
      errors: { message: 'an error occured on our server' },
    });
  });

  return app;
};

module.exports = createServer;
