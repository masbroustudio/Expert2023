const ReplyRepository = require("../../Domains/replies/ReplyRepository");
const AddedReply = require("../../Domains/replies/entities/AddedReply");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator, timestampGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._timestampGenerator = timestampGenerator;
  }

  async addReply(payload) {
    const { content, owner, commentId } = payload;
    const id = `reply-${this._idGenerator()}`;
    const date = this._timestampGenerator();

    const query = {
      text: "INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
      values: [id, content, date, owner, commentId],
    };

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async verifyReplyOwner(payload) {
    const { replyId, owner } = payload;

    const query = {
      text: "SELECT owner FROM replies WHERE id = $1",
      values: [replyId],
    };

    const { rows } = await this._pool.query(query);
    if (!rows.length) throw new NotFoundError("reply tidak ditemukan");
    if (rows[0].owner !== owner) {
      throw new AuthorizationError("Tidak dapat akses, anda bukan pemilik reply");
    }
  }

  async getReplyByCommentId(commentId) {
    const query = {
      text: `SELECT replies.*, users.username FROM replies
              LEFT JOIN users ON replies.owner = users.id
              WHERE replies.comment_id = $1
              ORDER BY replies.date ASC`,
      values: [commentId],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }

  async deleteReply(payload) {
    const { replyId, owner } = payload;

    const query = {
      text: "UPDATE replies SET is_delete = true WHERE id = $1 AND owner = $2",
      values: [replyId, owner],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
