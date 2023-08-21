const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const LikesCommentUseCase = require('../LikesCommentUseCase');

describe('LikesCommentUseCase', () => {
  it('should throw error if use case not contain param comment id', () => {
    // Arrange
    const useCasePayload = {};
    const likesCommentUseCase = new LikesCommentUseCase({});

    // Action & Assert
    expect(() => likesCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('LIKES_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if use case comment id & user id not string', () => {
    // Arrange
    const useCasePayload = {
      commentId: 1,
      threadId: 2,
      userId: 1,
    };
    const likesCommentUseCase = new LikesCommentUseCase({});

    // Action & Assert
    expect(() => likesCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('LIKES_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error if use case thread id not found', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'commentId',
      threadId: 'threadId',
      userId: 'userId',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.checkThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likesCommentUseCase = new LikesCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(() => likesCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('LIKES_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    expect(mockThreadRepository.checkThreadById).toBeCalledWith('threadId');
  });

  it('should throw error if use case comment id not found', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123-xx',
      threadId: 'thread-123-xx',
      userId: 'user-222',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.checkThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'thread-123-xx' }));
    mockCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likesCommentUseCase = new LikesCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(() => likesCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('LIKES_COMMENT_USE_CASE.COMMENT_NOT_FOUND');
    expect(mockThreadRepository.checkThreadById).toBeCalledWith('thread-123-xx');
    expect(mockCommentRepository.findCommentById).toBeCalledWith('comment-123-xx');
  });

  it('should return true if user already liked comment', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123-xx',
      threadId: 'thread-123-xx',
      userId: 'user-222',
    };

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockLikeRepository.verifyLiked = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'like-123-xx' }));

    const likesCommentUseCase = new LikesCommentUseCase({
      likeRepository: mockLikeRepository,
    });

    // Action
    await likesCommentUseCase._isLiked(useCasePayload);

    // Assert
    expect(mockLikeRepository.verifyLiked).toBeCalledWith({
      commentId: 'comment-123-xx',
      userId: 'user-222',
    });
  });

  it('should return false if user not liked comment', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123-xx',
      threadId: 'thread-123-xx',
      userId: 'user-222',
    };

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockLikeRepository.verifyLiked = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likesCommentUseCase = new LikesCommentUseCase({
      likeRepository: mockLikeRepository,
    });

    // Action
    await likesCommentUseCase._isLiked(useCasePayload);

    // Assert
    expect(mockLikeRepository.verifyLiked).toBeCalledWith({
      commentId: 'comment-123-xx',
      userId: 'user-222',
    });
  });

  it('should liked comment if use case payload is valid', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123-xx',
      threadId: 'thread-123-xx',
      userId: 'user-222',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.checkThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'thread-123-xx' }));
    mockCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'comment-123-xx' }));
    mockLikeRepository.verifyLiked = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likesCommentUseCase = new LikesCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likesCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkThreadById).toBeCalledWith('thread-123-xx');
    expect(mockCommentRepository.findCommentById).toBeCalledWith('comment-123-xx');
    expect(mockLikeRepository.verifyLiked).toBeCalledWith({
      commentId: 'comment-123-xx',
      userId: 'user-222',
    });
    expect(mockLikeRepository.addLike).toBeCalledWith({
      commentId: 'comment-123-xx',
      userId: 'user-222',
    });
  });

  it('should unliked comment if use case payload is valid', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123-xx',
      threadId: 'thread-123-xx',
      userId: 'user-222',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.checkThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'thread-123-xx' }));
    mockCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'comment-123-xx' }));
    mockLikeRepository.verifyLiked = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'like-123-xx' }));
    mockLikeRepository.removeLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likesCommentUseCase = new LikesCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likesCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkThreadById).toBeCalledWith('thread-123-xx');
    expect(mockCommentRepository.findCommentById).toBeCalledWith('comment-123-xx');
    expect(mockLikeRepository.verifyLiked).toBeCalledWith({
      commentId: 'comment-123-xx',
      userId: 'user-222',
    });
    expect(mockLikeRepository.removeLike).toBeCalledWith({
      commentId: 'comment-123-xx',
      userId: 'user-222',
    });
  });
});
