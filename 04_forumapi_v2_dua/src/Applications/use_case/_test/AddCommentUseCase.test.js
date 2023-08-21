const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should throw error if use case not contain param thread id', () => {
    // Arrange
    const useCasePayload = {};
    const addCommentUseCase = new AddCommentUseCase({});

    // Action & Assert
    expect(() => addCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_COMMENT_USE_CASE.NOT_CONTAIN_THREAD_ID');
  });

  it('should throw error if use case not param thread id not string', () => {
    // Arrange
    const useCasePayload = {
      threadId: 1,
    };
    const addCommentUseCase = new AddCommentUseCase({});

    // Action & Assert
    expect(() => addCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error if use case thread id not found', () => {
    // Arrange
    const useCasePayload = {
      threadId: 'threadId',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.checkThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    expect(() => addCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    expect(mockThreadRepository.checkThreadById).toBeCalledWith('threadId');
  });

  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123-xx',
      content: 'some content',
      owner: 'user-222',
    };
    const useCasePayloadComment = new AddComment({
      content: 'some content',
    });
    const expecttedComment = new AddedComment({
      id: 'comment-123',
      content: 'some content',
      owner: 'user-222',
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.checkThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'thread-123-xx' }));
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedComment({
        id: 'comment-123',
        content: useCasePayloadComment.content,
        owner: 'user-222',
      })));

    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const response = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(response).toStrictEqual(expecttedComment);
    expect(mockThreadRepository.checkThreadById).toBeCalledWith('thread-123-xx');
    expect(mockCommentRepository.addComment).toBeCalledWith({
      ...useCasePayload,
      owner: 'user-222',
    });
  });
});
