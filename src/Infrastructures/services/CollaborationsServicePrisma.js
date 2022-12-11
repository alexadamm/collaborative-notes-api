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
}

module.exports = CollaborationsServicePrisma;
