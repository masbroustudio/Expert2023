class LikeRepository {
  async checkLike(payload) {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async addLike(payload) {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async deleteLike(payload) {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getLikeCount(commentId) {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = LikeRepository;
