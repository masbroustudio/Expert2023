const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment) {
    const {
      content, threadId, owner,
    } = comment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO comment_threads VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, date, threadId, owner],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async findCommentById(id) {
    const query = {
      text: 'SELECT id, owner FROM comment_threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comment_threads SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async findCommentByThreadId(threadId) {
    const query = {
      text: `SELECT comment_threads.id, comment_threads.content, 
      comment_threads.date, comment_threads.is_delete, users.username,
      COUNT(like_comments.id) AS likecount
      FROM comment_threads
      LEFT JOIN users ON comment_threads.owner = users.id
      LEFT JOIN like_comments ON comment_threads.id = like_comments.comment_id
      WHERE comment_threads.thread_id = $1
      GROUP BY comment_threads.id, users.username
      ORDER BY comment_threads.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
