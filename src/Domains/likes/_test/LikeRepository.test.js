const LikeRepository = require("../LikeRepository");

describe("LikeRepository interface", () => {
  it("should throw error when invoke unimplemented method", async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action and Assert
    await expect(likeRepository.checkLike({})).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(likeRepository.addLike({})).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(likeRepository.deleteLike({})).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(likeRepository.getLikeCount("")).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
