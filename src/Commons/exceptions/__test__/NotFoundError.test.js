const ClientError = require('../ClientError');
const NotFoundError = require('../NotFoundError');

describe('NotFoundError', () => {
  it('should create an error correctly', () => {
    const notFoundError = new NotFoundError('an error occurs');

    expect(notFoundError).toBeInstanceOf(NotFoundError);
    expect(notFoundError).toBeInstanceOf(ClientError);
    expect(notFoundError).toBeInstanceOf(Error);

    expect(notFoundError.statusCode).toEqual(404);
    expect(notFoundError.message).toEqual('an error occurs');
    expect(notFoundError.name).toEqual('NotFoundError');
  });
});
