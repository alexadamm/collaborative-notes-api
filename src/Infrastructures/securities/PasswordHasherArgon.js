const PasswordHasher = require('../../Applications/securities/PasswordHasher');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');

class PasswordhHasherArgon extends PasswordHasher {
  constructor(argon2, saltRound = process.env.SALT_ROUND) {
    super();
    this.argon2 = argon2;
    this.saltRound = saltRound;
  }

  async hash(password) {
    return this.argon2.hash(password, this.saltRound);
  }

  async compare(password, hashedPassword) {
    const result = await this.argon2.verify(
      hashedPassword,
      password,
      { salt: this.saltRound },
    );

    if (!result) {
      throw new AuthenticationError('Wrong credentials. Invalid username or password');
    }
  }
}

module.exports = PasswordhHasherArgon;
