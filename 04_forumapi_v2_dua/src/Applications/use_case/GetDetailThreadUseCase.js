const GetThread = require('../../Domains/threads/entities/GetThread');

class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(payload) {
    await this._verifyPayload(payload);
    const { threadId } = payload;

    const thread = await this._threadRepository.getDetailThreadById(threadId);
    const comments = await this._commentRepository.findCommentByThreadId(threadId);
    const result = await this._combineTheradWithCommentReplies({ thread, comments });

    return new GetThread(result);
  }

  async _verifyPayload(payload) {
    const { threadId } = payload;

    if (!threadId) {
      throw new Error('GET_DETAIL_THREAD_USE_CASE.NOT_CONTAIN_THREAD_ID');
    }

    if (typeof threadId !== 'string') {
      throw new Error('GET_DETAIL_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    const result = await this._threadRepository.checkThreadById(threadId);

    if (!result) {
      throw new Error('GET_DETAIL_THREAD_USE_CASE.THREAD_NOT_FOUND');
    }
  }

  async _combineTheradWithCommentReplies({ thread, comments }) {
    return {
      ...thread,
      comments: await this._commentsMapping(comments),
    };
  }

  _repliesMapping(replies) {
    return replies.map((reply) => ({
      id: reply.id,
      content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
      date: reply.date,
      username: reply.username,
    }));
  }

  async _commentsMapping(comments) {
    const commentIds = comments.map((comment) => comment.id);
    const replies = await this._replyRepository.findReplyByCommentId(commentIds);

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
      date: comment.date,
      username: comment.username,
      likeCount: Number(comment.likecount),
      replies: this._repliesMapping(replies.filter((reply) => reply.comment_id === comment.id)),
    }));
  }
}

module.exports = GetDetailThreadUseCase;
