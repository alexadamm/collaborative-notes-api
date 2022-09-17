const express = require('express');
const { default: helmet } = require('helmet');
const ClientError = require('../../Commons/exceptions/ClientError');

const userRouter = require('../../Interfaces/http/api/users/routes');

const app = express();

app.use(express.json());

app.use(helmet());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRouter);

// Error handler
app.use((req, res) => {
  res.status(404).send({
    message: 'Page not found',
  });
});

app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.statusCode).send({
      isSuccess: false,
      message: err.message,
    });
  } else {
    res.status(500).send({
      isSuccess: false,
      message: 'an error occured on our server',
    });

    console.error(err);
  }
  // eslint-disable-next-line no-useless-return
  return;
});

module.exports = app;
