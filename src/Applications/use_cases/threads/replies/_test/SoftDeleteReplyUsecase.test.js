const ThreadsRepository = require('../../../../../Domains/threads/ThreadsRepository')
const ThreadCommentsRepository = require('../../../../../Domains/threads/comments/ThreadCommentsRepository')
const ThreadCommentRepliesRepository = require('../../../../../Domains/threads/replies/ThreadCommentRepliesRepository')

const SoftDeleteReplyUsecase = require('src/Applications/use_cases/threads/replies/_test/SoftDeleteReplyUsecase.test.js')

describe('SoftDeleteReplyUsecase', () => {
  it('should orchestracting the delete reply action correctly', async () => {
    // Arrange
    const mockThreadCommentRepliesRepo = new ThreadCommentRepliesRepository()
    const mockThreadCommentsRepo = new ThreadCommentsRepository()
    const mockThreadsRepo = new ThreadsRepository()

    mockThreadCommentRepliesRepo.softDeleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadCommentsRepo.verifyCommentLocation = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadsRepo.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const usecase = new SoftDeleteReplyUsecase({
      threadCommentRepliesRepository: mockThreadCommentRepliesRepo,
      threadCommentsRepository: mockThreadCommentsRepo,
      threadsRepository: mockThreadsRepo
    })

    // Action
    await usecase.execute('thread-123', 'comment-123', 'reply-123', 'user-123')

    // Assert
    expect(mockThreadsRepo.getThreadById).toBeCalledWith('thread-123')
    expect(mockThreadCommentsRepo.verifyCommentLocation).toBeCalledWith(
      'comment-123', 'thread-123'
    )
    expect(mockThreadCommentRepliesRepo.softDeleteReply).toBeCalledWith(
      'reply-123', 'user-123'
    )
  })
})
