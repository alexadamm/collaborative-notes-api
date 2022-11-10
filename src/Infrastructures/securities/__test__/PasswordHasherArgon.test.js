const argon2 = require('argon2');

const PasswordHasherHelper = require('../../../../tests/PasswordHasherHelper');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
const PasswordHasherArgon = require('../PasswordHasherArgon');

describe('PasswordHasherArgon', () => {
  describe('hash method', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(argon2, 'hash');
      const salt = 'testingsalt';
      const password = 'plain_password';
      const passwordHasherArgon = new PasswordHasherArgon(argon2, salt);

      // Action
      const encryptedPassword = await passwordHasherArgon.hash(password);

      // Assert
      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual(password);
      expect(spyHash).toBeCalledWith(password, salt);
    });
  });

  describe('compare method', () => {
    it('should throw AuthenticationError if password not match', async () => {
      // Arrange
      const spyHash = jest.spyOn(argon2, 'verify');
      const salt = 'testingsalt';
      const password = 'plain_password';
      const passwordHasherArgon = new PasswordHasherArgon(argon2, salt);
      const encryptedPassword = await PasswordHasherHelper.hash(password);

      // Action and Assert
      expect(passwordHasherArgon.compare('plain_password2', encryptedPassword))
        .rejects.toThrowError(AuthenticationError);
      expect(spyHash).toBeCalledWith(encryptedPassword, 'plain_password2', { salt });
    });

    it('should not throw AuthenticationError if password match', async () => {
      // Arrange
      const spyHash = jest.spyOn(argon2, 'verify');
      const salt = 'testingsalt';
      const password = 'plain_password';
      const passwordHasherArgon = new PasswordHasherArgon(argon2, salt);
      const encryptedPassword = await PasswordHasherHelper.hash(password);

      // Action and Assert
      expect(passwordHasherArgon.compare(password, encryptedPassword))
        .resolves.not.toThrowError(AuthenticationError);
      expect(await passwordHasherArgon.compare(password, encryptedPassword)).toEqual(undefined);
    });
  });
});
