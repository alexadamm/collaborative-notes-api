class NewCollaboration {
  constructor(payload) {
    const { noteId, userId } = payload;
    this.noteId = noteId;
    this.userId = userId;
  }
}

module.exports = NewCollaboration;
