const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    await this._verifyPayload(payload);
    const { content, commentId, owner } = payload;

    const addReply = new AddReply({ content });
    return this._replyRepository.addReply({ ...addReply, commentId, owner });
  }

  async _verifyPayload(payload) {
    const { commentId, threadId, content } = payload;

    if (!content || !threadId || !commentId) {
      throw new Error('ADD_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof threadId !== 'string' || typeof content !== 'string') {
      throw new Error('ADD_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    const thread = await this._threadRepository.checkThreadById(threadId);
    if (!thread) {
      throw new Error('ADD_REPLY_USE_CASE.THREAD_NOT_FOUND');
    }

    const comment = await this._commentRepository.findCommentById(commentId);

    if (!comment) {
      throw new Error('ADD_REPLY_USE_CASE.COMMENT_NOT_FOUND');
    }
  }
}

module.exports = AddReplyUseCase;
