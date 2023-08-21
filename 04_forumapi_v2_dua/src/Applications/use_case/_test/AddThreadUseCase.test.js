const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = new AddThread({
      title: 'title',
      body: 'body',
      owner: 'user-222',
    });
    const expecttedThread = new AddedThread({
      id: 'thread-123',
      title: 'title thread',
      owner: 'user-232',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedThread({
        id: 'thread-123',
        title: 'title thread',
        owner: 'user-232',
      })));

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const response = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(response).toStrictEqual(expecttedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(useCasePayload);
  });
});
