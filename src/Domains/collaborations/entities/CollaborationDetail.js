class CollaborationDetail {
  constructor(payload) {
    this.id = payload.id;
    this.noteId = payload.noteId;
    this.username = payload.username;
  }
}

module.exports = CollaborationDetail;
