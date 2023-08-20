class CommentRepository {
  async addComment(payload) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyAvailableComment(commentId) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getCommentByThreadId(threadId) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyCommentOwner(payload) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async deleteComment(payload) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = CommentRepository;
