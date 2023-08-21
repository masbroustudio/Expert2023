const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case params not contain comment id', async () => {
    // Arrange
    const useCaseParams = {};

    // Action & Assert
    await expect(new DeleteCommentUseCase({}).execute(useCaseParams))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_COMMENT_ID');
  });

  it('should throw error if comment id not string', async () => {
    // Arrange
    const useCaseParams = {
      commentId: 123,
    };

    // Action & Assert
    await expect(new DeleteCommentUseCase({}).execute(useCaseParams))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error if comment not found', async () => {
    // Arrange
    const useCaseParams = {
      commentId: 'commentId',
    };
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // Action & Assert
    await expect(new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    }).execute(useCaseParams))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.COMMENT_NOT_FOUND');
    expect(mockCommentRepository.findCommentById).toHaveBeenCalledWith('commentId');
  });

  it('should throw error if comment not owner of comment', async () => {
    // Arrange
    const useCaseParams = {
      commentId: 'commentdel',
      owner: 'user-333',
    };
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'commentdel', owner: 'user-123321' }));

    // Action & Assert
    await expect(new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    }).execute(useCaseParams))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.COMMENT_NOT_OWNER');
    expect(mockCommentRepository.findCommentById).toHaveBeenCalledWith('commentdel');
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCaseParams = {
      commentId: 'commentdel2',
      owner: 'commentdel2',
    };
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'commentdel2', owner: 'commentdel2' }));
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // Action
    await new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    }).execute(useCaseParams);

    // Assert
    expect(mockCommentRepository.findCommentById).toHaveBeenCalledWith('commentdel2');
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith('commentdel2');
  });
});
