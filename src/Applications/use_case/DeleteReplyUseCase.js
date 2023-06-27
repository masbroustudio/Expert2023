class DeleteReplyUseCase {
  constructor({commentRepository, replyRepository}) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);

    await this._commentRepository.verifyAvailableComment(useCasePayload.commentId);
    await this._replyRepository.verifyReplyOwner(useCasePayload);
    await this._replyRepository.deleteReply(useCasePayload);
  }

  _verifyPayload({owner, commentId, replyId}) {
    if (!owner) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_OWNER');
    }

    if (!commentId || !replyId) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof commentId !== 'string' || typeof replyId !== 'string') {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReplyUseCase;
