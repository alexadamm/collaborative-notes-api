const express = require('express');
const { default: helmet } = require('helmet');
const ClientError = require('../../Commons/exceptions/ClientError');

const users = require('../../Interfaces/http/api/users/routes');

const createServer = async (container) => {
  const app = express();

  app.use(express.json());
  app.use(helmet());
  app.use(express.urlencoded({ extended: true }));

  app.use('/users', users(container));

  // Error handler
  app.use((req, res) => {
    res.status(404).send({
      message: 'Page not found',
    });
  });

  app.use((err, req, res, next) => {
    if (err instanceof ClientError) {
      return res.status(err.statusCode).send({
        isSuccess: false,
        message: err.message,
      });
    }
    return res.status(500).send({
      isSuccess: false,
      message: 'an error occured on our server',
    });
  });

  return app;
};

module.exports = createServer;
