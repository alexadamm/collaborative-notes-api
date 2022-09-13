class PasswordHasher {
  async hash(plainPassword) {
    throw new Error('PASSWORD_HASHER.METHOD_NOT_IMPLEMENTED');
  }

  async compare(plainPassword, encryptedPassword) {
    throw new Error('PASSWORD_HASHER.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = PasswordHasher;
