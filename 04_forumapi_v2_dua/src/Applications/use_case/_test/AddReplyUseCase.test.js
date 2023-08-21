const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should throw error if use case not contain needed property', () => {
    const useCase = new AddReplyUseCase({});

    expect(() => useCase.execute({}))
      .rejects
      .toThrowError('ADD_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if use case not meet data type specification', () => {
    // Arrange
    const useCasePayload = {
      content: 1212,
      owner: 'user-222',
      threadId: 34,
      commentId: 1,
    };
    const addReplyUseCase = new AddReplyUseCase({});

    // Action & Assert
    expect(() => addReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error if use case thread id not found', () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
      owner: 'user-222',
      threadId: 'threadId',
      commentId: 'commentId',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.checkThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    expect(() => addReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_REPLY_USE_CASE.THREAD_NOT_FOUND');
    expect(mockThreadRepository.checkThreadById).toHaveBeenCalledWith('threadId');
  });

  it('should throw error if use case comment id not found', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
      owner: 'user-222',
      threadId: 'threadId',
      commentId: 'commentId',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.checkThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'threadId' }));
    mockCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const addReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Actions & Assert
    await expect(() => addReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_REPLY_USE_CASE.COMMENT_NOT_FOUND');
    expect(mockThreadRepository.checkThreadById).toHaveBeenCalledWith('threadId');
    expect(mockCommentRepository.findCommentById).toHaveBeenCalledWith('commentId');
  });

  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123-xxx',
      content: 'reply content',
      owner: 'user-22288',
      threadId: 'thread-123-xxs',
    };
    const useCasePayloadReply = new AddReply({
      content: 'reply content',
    });
    const expecttedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayloadReply.content,
      owner: 'user-22288',
    });

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.checkThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'thread-123-xxs' }));
    mockCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'comment-123-xxx' }));
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedReply({
        id: 'reply-123',
        content: useCasePayloadReply.content,
        owner: 'user-22288',
      })));

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const reply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(reply).toEqual(expecttedReply);
    expect(mockThreadRepository.checkThreadById).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.findCommentById).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith({
      content: useCasePayloadReply.content,
      owner: useCasePayload.owner,
      commentId: useCasePayload.commentId,
    });
  });
});
