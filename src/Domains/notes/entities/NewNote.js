class AddNote {
  constructor(payload) {
    const {
      id, ownerId, title, content,
    } = payload;
    this.id = id;
    this.ownerId = ownerId;
    this.title = title;
    this.content = content;
  }
}

module.exports = AddNote;
