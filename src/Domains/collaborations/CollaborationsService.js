class CollaborationsService {
  async addCollaboration(newCollaboration) {
    throw new Error('COLLABORATION_SERVICE.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCollaborator(noteId, userId) {
    throw new Error('COLLABORATION_SERVICE.METHOD_NOT_IMPLEMENTED');
  }

  async getCollaborators(noteId) {
    throw new Error('COLLABORATION_SERVICE.METHOD_NOT_IMPLEMENTED');
  }

  async getCollaborationId(noteId, userId) {
    throw new Error('COLLABORATION_SERVICE.METHOD_NOT_IMPLEMENTED');
  }

  async deleteCollaborationById(collaborationId) {
    throw new Error('COLLABORATION_SERVICE.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CollaborationsService;
