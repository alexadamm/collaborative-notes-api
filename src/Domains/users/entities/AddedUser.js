class AddedUser {
  constructor(payload) {
    const { id, username, fullname } = payload;

    this.id = id;
    this.username = username;
    this.fullname = fullname;
  }
}

module.exports = AddedUser;
