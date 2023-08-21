class DeleteCommentUseCase {
  constructor({
    commentRepository,
  }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this._validatePayload(useCasePayload);
    const { commentId } = useCasePayload;

    await this._commentRepository.deleteComment(commentId);
  }

  async _validatePayload(payload) {
    const { commentId, owner } = payload;
    if (!commentId) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_COMMENT_ID');
    }

    if (typeof commentId !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    const comment = await this._commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new Error('DELETE_COMMENT_USE_CASE.COMMENT_NOT_FOUND');
    }

    if (comment.owner !== owner) {
      throw new Error('DELETE_COMMENT_USE_CASE.COMMENT_NOT_OWNER');
    }
  }
}

module.exports = DeleteCommentUseCase;
