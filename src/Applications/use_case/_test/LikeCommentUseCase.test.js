const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const LikeRepository = require("../../../Domains/likes/LikeRepository");
const LikeCommentUseCase = require("../LikeCommentUseCase");

describe("LikeCommentUseCase", () => {
  it("should throw error if use case payload not contain owner", async () => {
    // Arrange
    const useCasePayload = {};

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action & Assert
    await expect(
      likeCommentUseCase.execute(useCasePayload)
    ).rejects.toThrowError("LIKE_COMMENT_USE_CASE.NOT_CONTAIN_OWNER");
  });

  it("should throw error if use case payload not contain threadId, commentId", async () => {
    // Arrange
    const useCasePayload = {
      threadId: undefined,
      commentId: undefined,
      owner: "user-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action & Assert
    await expect(
      likeCommentUseCase.execute(useCasePayload)
    ).rejects.toThrowError("LIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error if use case payload not meet data type specification", async () => {
    // Arrange
    const useCasePayload = {
      threadId: {},
      commentId: [],
      owner: 123,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action & Assert
    await expect(
      likeCommentUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      "LIKE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should orchestrating the add like action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      owner: "user-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve()
    );

    mockCommentRepository.verifyAvailableComment = jest.fn(() =>
      Promise.resolve()
    );

    mockLikeRepository.checkLike = jest.fn(() => Promise.resolve(false));

    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.threadId
    );

    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(
      useCasePayload.commentId
    );

    expect(mockLikeRepository.checkLike).toHaveBeenCalledWith(useCasePayload);

    expect(mockLikeRepository.addLike).toHaveBeenCalledWith(useCasePayload);
  });

  it("should orchestrating the delete like action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      owner: "user-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve()
    );

    mockCommentRepository.verifyAvailableComment = jest.fn(() =>
      Promise.resolve()
    );

    mockLikeRepository.checkLike = jest.fn(() => Promise.resolve(true));

    mockLikeRepository.deleteLike = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(
      useCasePayload.commentId
    );
    expect(mockLikeRepository.checkLike).toHaveBeenCalledWith(useCasePayload);
    expect(mockLikeRepository.deleteLike).toHaveBeenCalledWith(useCasePayload);
  });
});
