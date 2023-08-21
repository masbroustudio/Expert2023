class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this._validatePayload(useCasePayload);
    const { replyId } = useCasePayload;

    await this._replyRepository.deleteReply(replyId);
  }

  async _validatePayload(payload) {
    const { replyId, owner } = payload;
    if (!replyId) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_REPLY_ID');
    }

    if (typeof replyId !== 'string') {
      throw new Error('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    const reply = await this._replyRepository.findReplyById(replyId);
    if (!reply) {
      throw new Error('DELETE_REPLY_USE_CASE.REPLY_NOT_FOUND');
    }

    if (reply.owner !== owner) {
      throw new Error('DELETE_REPLY_USE_CASE.REPLY_NOT_OWNER');
    }
  }
}

module.exports = DeleteReplyUseCase;
