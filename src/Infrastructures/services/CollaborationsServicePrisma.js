const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CollaborationsService = require('../../Domains/collaborations/CollaborationsService');
const CollaborationDetail = require('../../Domains/collaborations/entities/CollaborationDetail');

class CollaborationsServicePrisma extends CollaborationsService {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async addCollaboration(newCollaboration) {
    const collaboration = await this.pool.Collaboration.create({
      data: newCollaboration,
      include: {
        user: {
          select: { username: true },
        },
      },
    });

    return new CollaborationDetail({ ...collaboration, username: collaboration.user.username });
  }

  async getCollaborationId(newCollaboration) {
    const result = await this.pool.Collaboration.findUnique({
      where: {
        noteId_userId: newCollaboration,
      },
      select: { id: true },
    });

    if (!result) {
      throw new NotFoundError('Collaboration not found');
    }
    return result.id;
  }

  async deleteCollaborationById(collaborationId) {
    return this.pool.Collaboration.delete({
      where: { id: collaborationId },
    });
  }
}

module.exports = CollaborationsServicePrisma;
