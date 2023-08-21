const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    await this._verifyPayload(payload);
    const { content, threadId, owner } = payload;

    const addComment = new AddComment({ content });
    return this._commentRepository.addComment({ ...addComment, threadId, owner });
  }

  async _verifyPayload(payload) {
    const { threadId } = payload;

    if (!threadId) {
      throw new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_THREAD_ID');
    }

    if (typeof threadId !== 'string') {
      throw new Error('ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    const result = await this._threadRepository.checkThreadById(threadId);

    if (!result) {
      throw new Error('ADD_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    }
  }
}

module.exports = AddCommentUseCase;
