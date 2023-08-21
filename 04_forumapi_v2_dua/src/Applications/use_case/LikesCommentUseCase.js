class LikesCommentUseCase {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._verifyPayload(useCasePayload);
    const { commentId, userId } = useCasePayload;

    const isLiked = await this._isLiked({ commentId, userId });
    if (isLiked) {
      return this._likeRepository.removeLike({ commentId, userId });
    }
    return this._likeRepository.addLike({ commentId, userId });
  }

  async _verifyPayload({ commentId, threadId }) {
    if (!commentId || !threadId) {
      throw new Error('LIKES_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof threadId !== 'string') {
      throw new Error('LIKES_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    const thread = await this._threadRepository.checkThreadById(threadId);
    if (!thread) {
      throw new Error('LIKES_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    }

    const comment = await this._commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new Error('LIKES_COMMENT_USE_CASE.COMMENT_NOT_FOUND');
    }
  }

  async _isLiked({ commentId, userId }) {
    return this._likeRepository.verifyLiked({ commentId, userId });
  }
}

module.exports = LikesCommentUseCase;
