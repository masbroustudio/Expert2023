class ReplyRepository {
  async addReply(payload) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyReplyOwner(payload) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getReplyByCommentId(commentId) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async deleteReply(payload) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = ReplyRepository;
