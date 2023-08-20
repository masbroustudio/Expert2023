const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator, timestampGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._timestampGenerator = timestampGenerator;
  }

  async addComment(payload) {
    const { content, owner, threadId } = payload;
    const id = `comment-${this._idGenerator()}`;
    const date = this._timestampGenerator();

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
      values: [id, content, date, owner, threadId],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async verifyAvailableComment(commentId) {
    const query = {
      text: "SELECT id FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("comment tidak valid atau tidak ditemukan");
    } else {
      return result.rows[0];
    }
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: `SELECT comments.*, users.username FROM comments
            LEFT JOIN users ON comments.owner = users.id
            WHERE comments.thread_id = $1
            ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyCommentOwner(payload) {
    const { commentId, owner } = payload;

    const query = {
      text: "SELECT owner FROM comments WHERE id = $1",
      values: [commentId],
    };

    const { rows } = await this._pool.query(query);
    
    if (!rows.length) throw new NotFoundError("comment tidak valid atau tidak ditemukan");
    
    if (rows[0].owner !== owner) {
      throw new AuthorizationError("Tidak dapat akses, anda bukan pemilik comment");
    }
  }

  async deleteComment(payload) {
    const { commentId, owner } = payload;

    const query = {
      text: "UPDATE comments SET is_delete = true WHERE id = $1 AND owner = $2",
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
