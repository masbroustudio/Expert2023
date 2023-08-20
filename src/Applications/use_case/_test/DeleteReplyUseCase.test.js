const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const DeleteReplyUseCase = require("../DeleteReplyUseCase");

describe("DeleteReplyUseCase", () => {
  it("should throw error if use case payload not contain owner", async () => {
    // Arrange
    const useCasePayload = {};

    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    const deleteReplyUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(
      deleteReplyUseCase.execute(useCasePayload)
    ).rejects.toThrowError("DELETE_REPLY_USE_CASE.NOT_CONTAIN_OWNER");
  });

  it("should throw error if use case payload not contain threadId, commentId, replyId", async () => {
    // Arrange
    const useCasePayload = {
      commentId: undefined,
      replyId: undefined,
      owner: "user-123",
    };

    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    const deleteReplyUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(
      deleteReplyUseCase.execute(useCasePayload)
    ).rejects.toThrowError("DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error if use case payload not meet data type specification", async () => {
    // Arrange
    const useCasePayload = {
      commentId: {},
      replyId: [],
      owner: 123,
    };

    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    const deleteReplyUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(
      deleteReplyUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      "DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should orchestrating the delete reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      commentId: "comment-123",
      replyId: "reply-123",
      owner: "user-123",
    };

    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.verifyReplyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(
      useCasePayload.commentId
    );

    expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(
      useCasePayload
    );

    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(
      useCasePayload
    );
  });
});
