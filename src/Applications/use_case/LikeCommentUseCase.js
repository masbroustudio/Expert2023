class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);

    await this._threadRepository.verifyAvailableThread(useCasePayload.threadId);
    await this._commentRepository.verifyAvailableComment(
      useCasePayload.commentId
    );

    const likeState = await this._likeRepository.checkLike(useCasePayload);

    if (likeState) {
      await this._likeRepository.deleteLike(useCasePayload);
    } else {
      await this._likeRepository.addLike(useCasePayload);
    }
  }

  _validatePayload(payload) {
    const { threadId, commentId, owner } = payload;
    if (!owner) {
      throw new Error("LIKE_COMMENT_USE_CASE.NOT_CONTAIN_OWNER");
    }
    if (!threadId || !commentId) {
      throw new Error("LIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY");
    }
    if (
      typeof threadId !== "string" ||
      typeof commentId !== "string" ||
      typeof owner !== "string"
    ) {
      throw new Error("LIKE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = LikeCommentUseCase;
