const ThreadRepository = require("../ThreadRepository");

describe("ThreadRepository interface", () => {
  it("should throw error when invoke not implemented mothod", async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action & Assert
    await expect(threadRepository.addThread({})).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(threadRepository.verifyThreadById("")).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(threadRepository.getThreadById("")).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
  });
});
