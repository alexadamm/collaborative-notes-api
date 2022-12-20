const CollaborationsService = require('../CollaborationsService');

describe('CollaborationsService interface', () => {
  it('should throw error when invoke unimplemented function', async () => {
    // Arrange
    const collaborationsService = new CollaborationsService();

    // Action and Assert
    expect(collaborationsService.addCollaboration('', '')).rejects.toThrowError('COLLABORATION_SERVICE.METHOD_NOT_IMPLEMENTED');
    expect(collaborationsService.getCollaborationId('', '')).rejects.toThrowError('COLLABORATION_SERVICE.METHOD_NOT_IMPLEMENTED');
    expect(collaborationsService.deleteCollaborationById('')).rejects.toThrowError('COLLABORATION_SERVICE.METHOD_NOT_IMPLEMENTED');
  });
});
