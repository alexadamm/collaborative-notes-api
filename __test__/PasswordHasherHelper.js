const argon2 = require('argon2');

const PasswordHasherHelper = {
  async hash(password, salt = 'testingsalt') {
    return argon2.hash(password, salt);
  },
};

module.exports = PasswordHasherHelper;
