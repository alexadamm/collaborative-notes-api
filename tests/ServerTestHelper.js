/* istanbul ignore file */
const ServerTestHelper = {
  async newUser({ request, app }, {
    username = 'johndoe', fullname = 'John Doe', password = 'secret',
  }) {
    const newUserResponse = await request(app).post('/users').send({ username, fullname, password });
    const { id: userId } = newUserResponse.body.data.addedUser;
    const loginResponse = await request(app).post('/authentications').send({ username, password });
    const { accessToken, refreshToken } = loginResponse.body.data;
    return { userId, accessToken, refreshToken };
  },
};

module.exports = ServerTestHelper;
