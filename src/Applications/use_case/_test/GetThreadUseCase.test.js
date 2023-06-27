const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve({
          id: 'thread-123',
          title: 'sebuah thread',
          body: 'sebuah body thread',
          date: '2021-08-08T07:22:33.555Z',
          owner: 'user-123',
        }));

    mockCommentRepository.getCommentByThreadId = jest.fn()
        .mockImplementation(() => Promise.resolve([{
          id: 'comment-123',
          content: 'Comment from earth',
          date: '2021-08-08T07:22:33.555Z',
          owner: 'user-123',
          thread_id: 'thread-123',
          is_delete: false,
          username: 'dicoding',
        }]));

    mockReplyRepository.getReplyByCommentId = jest.fn()
        .mockImplementation(() => Promise.resolve([{
          id: 'reply-123',
          content: 'Reply from Mars',
          date: '2021-08-09T08:15:30.123Z',
          owner: 'user-123',
          thread_id: 'thread-123',
          is_delete: false,
          username: 'dicoding',
        }]));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const result = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThreadById)
        .toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentByThreadId)
        .toBeCalledWith(useCasePayload);
    expect(mockReplyRepository.getReplyByCommentId)
        .toBeCalledWith('comment-123');
    expect(result).toStrictEqual({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:22:33.555Z',
      owner: 'user-123',
      comments: [{
        id: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08T07:22:33.555Z',
        content: 'Comment from earth',
        replies: [{
          id: 'reply-123',
          content: 'Reply from Mars',
          date: '2021-08-09T08:15:30.123Z',
          username: 'dicoding',
        }],
      }],
    });
  });

  it('should orchestrating the get thread action correctly with is_deleted true', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve({
          id: 'thread-123',
          title: 'sebuah thread',
          body: 'sebuah body thread',
          date: '2021-08-08T07:22:33.555Z',
          owner: 'user-123',
        }));
    mockCommentRepository.getCommentByThreadId = jest.fn()
        .mockImplementation(() => Promise.resolve([{
          id: 'comment-123',
          content: 'Comment from earth',
          date: '2021-08-08T07:22:33.555Z',
          owner: 'user-123',
          thread_id: 'thread-123',
          is_delete: true,
          username: 'dicoding',
        }]));
    mockReplyRepository.getReplyByCommentId = jest.fn()
        .mockImplementation(() => Promise.resolve([{
          id: 'reply-123',
          content: 'Reply from Mars',
          date: '2021-08-09T08:15:30.123Z',
          owner: 'user-123',
          thread_id: 'thread-123',
          is_delete: true,
          username: 'dicoding',
        }]));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const result = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThreadById)
        .toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentByThreadId)
        .toBeCalledWith(useCasePayload);
    expect(mockReplyRepository.getReplyByCommentId)
        .toBeCalledWith('comment-123');
    expect(result).toStrictEqual({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:22:33.555Z',
      owner: 'user-123',
      comments: [{
        id: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08T07:22:33.555Z',
        content: '**komentar telah dihapus**',
        replies: [{
          id: 'reply-123',
          content: '**balasan telah dihapus**',
          date: '2021-08-09T08:15:30.123Z',
          username: 'dicoding',
        }],
      }],
    });
  });
});