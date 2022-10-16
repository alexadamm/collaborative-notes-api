const AuthenticationTokenManager = require('../../Applications/securities/AuthenticationTokenManager');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');
const ClientError = require('../../Commons/exceptions/ClientError');
const UsersService = require('../../Domains/users/UsersService');
const container = require('../container');

class ServerMiddlewares {
  static unregisteredRouteHandler(req, res) {
    res.status(404).send({
      isSuccess: false,
      status: 'NOT_FOUND',
      errors: { message: 'Page not found' },
    });
  }

  static errorHandler(err, req, res, next) {
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
  }

  static async authenticationHandler(req, res, next) {
    try {
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const usersService = container.getInstance(UsersService.name);

      const bearerHeader = req.headers.authorization;

      if (typeof bearerHeader === 'undefined') {
        throw new AuthenticationError({ message: 'No token provided' });
      }

      const bearerToken = bearerHeader.split(' ')[1];

      const { id: userId, username } = await authTokenManager.decodePayload(bearerToken);
      await usersService.getUserById(userId);

      req.auth = { userId, username };
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = ServerMiddlewares;
