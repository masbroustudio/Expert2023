const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('DeleteReplyUseCase', () => {
  it('should throw error if use case param not contain reply id', async () => {
    // Arrange
    const useCaseParams = {};

    // Action & Assert
    await expect(new DeleteReplyUseCase({}).execute(useCaseParams))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_REPLY_ID');
  });

  it('should throw error if reply id not string', async () => {
    // Arrange
    const useCaseParams = {
      replyId: 123,
    };

    // Action & Assert
    await expect(new DeleteReplyUseCase({}).execute(useCaseParams))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error if reply not found', async () => {
    // Arrange
    const useCaseParams = {
      replyId: 'reply-id-1',
    };
    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.findReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve(null));

    // Action
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Assert
    expect(deleteReplyUseCase.execute(useCaseParams))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.REPLY_NOT_FOUND');
    expect(mockReplyRepository.findReplyById).toHaveBeenCalledWith('reply-id-1');
  });

  it('should throw error if reply not owner of reply', async () => {
    // Arrange
    const useCaseParams = {
      replyId: 'replyfordel',
      owner: 'user-12333',
    };
    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.findReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve({ owner: 'replydel' }));

    // Action
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Assert
    expect(deleteReplyUseCase.execute(useCaseParams))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.REPLY_NOT_OWNER');
    expect(mockReplyRepository.findReplyById).toHaveBeenCalledWith('replyfordel');
  });

  it('should orchestrating the delete reply action corretly', async () => {
    // Arrange
    const useCaseParams = {
      replyId: 'replyfordelete',
      owner: 'replydel22',
    };

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.findReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'replyfordelete', owner: 'replydel22' }));
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // Action
    await new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    }).execute(useCaseParams);

    // Assert
    expect(mockReplyRepository.findReplyById).toHaveBeenCalledWith('replyfordelete');
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith('replyfordelete');
  });
});
