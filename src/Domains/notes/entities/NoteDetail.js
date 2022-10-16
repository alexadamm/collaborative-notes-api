class AddedNote {
  constructor(payload) {
    const {
      id, owner, title, content, updatedAt, createdAt,
    } = payload;
    this.id = id;
    this.owner = owner;
    this.title = title;
    this.content = content;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}

module.exports = AddedNote;
