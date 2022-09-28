class LoginUser {
  constructor(payload) {
    const { username, password } = payload;
    this.username = username;
    this.password = password;
  }
}

module.exports = LoginUser;
