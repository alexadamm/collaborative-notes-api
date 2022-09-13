const PasswordHasher = require('../PasswordHasher');

describe('PasswordHasher interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const passwordHasher = new PasswordHasher();

    // Action and Assert
    expect(passwordHasher.hash('dummy_password')).rejects.toThrowError('PASSWORD_HASHER.METHOD_NOT_IMPLEMENTED');
    expect(passwordHasher.compare('plain_password', 'encrypted_password')).rejects.toThrowError('PASSWORD_HASHER.METHOD_NOT_IMPLEMENTED');
  });
});
