const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(reply) {
    const {
      content, commentId, owner,
    } = reply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO replies VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, date, commentId, owner],
    };

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async findReplyById(id) {
    const query = {
      text: 'SELECT id, owner FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async findReplyByCommentId(commentId) {
    const query = {
      text: `SELECT replies.*, users.username
      FROM replies
      INNER JOIN users ON users.id = replies.owner
      WHERE replies.comment_id = ANY($1::text[])
      GROUP BY replies.id, users.username
      ORDER BY replies.date ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ReplyRepositoryPostgres;
