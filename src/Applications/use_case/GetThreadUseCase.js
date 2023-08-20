class GetThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    const threads = await this._threadRepository.getThreadById(threadId);
    
    const comments =
      await this._commentRepository.getCommentByThreadId(threadId);

    const mappedPayload = {
      ...threads,
      comments: await Promise.all(
        comments.map(async (comment) => {
          const replies = await this._replyRepository.getReplyByCommentId(
            comment.id,
          );
          const mappedComment = {
            id: comment.id,
            username: comment.username,
            date: comment.date,
            content: comment.is_delete
              ? "**komentar telah dihapus**"
              : comment.content,
            likeCount: await this._likeRepository.getLikeCount(comment.id),
          };

          mappedComment.replies = replies.map((reply) => ({
            id: reply.id,
            content: reply.is_delete
              ? "**balasan telah dihapus**"
              : reply.content,
            date: reply.date,
            username: reply.username,
          }));

          return mappedComment;
        }),
      ),
    };

    return mappedPayload;
  }
}

module.exports = GetThreadUseCase;
