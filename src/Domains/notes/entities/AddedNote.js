class AddedNote {
  constructor(payload) {
    const {
      id, ownerId, title, content, updatedAt, createdAt,
    } = payload;
    this.id = id;
    this.ownerId = ownerId;
    this.title = title;
    this.content = content;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}

module.exports = AddedNote;
