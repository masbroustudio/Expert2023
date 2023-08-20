const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddCommentUseCase = require("../AddCommentUseCase");

describe("AddCommentUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the add comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      owner: "user-123",
      content: "HELLO MARS",
      threadId: "thread-123",
    };

    const mockAddedComment = new AddedComment({
      id: "comment-123",
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: "comment-123",
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      }),
    );
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        threadId: useCasePayload.threadId,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      }),
    );
  });
});
