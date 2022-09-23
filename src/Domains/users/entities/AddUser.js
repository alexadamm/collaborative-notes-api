/* eslint-disable class-methods-use-this */
class AddUser {
  constructor(payload) {
    const { username, password, fullname } = payload;
    this.username = username;
    this.password = password;
    this.fullname = fullname;
  }
}
module.exports = AddUser;
