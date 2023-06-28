const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async checkLike(payload) {
    const {owner, commentId} = payload;

    const query = {
      text: 'SELECT id FROM likes WHERE owner = $1 AND comment_id = $2',
      values: [owner, commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return false;
    } else {
      return true;
    };
  }

  async addLike(payload) {
    const {owner, commentId} = payload;
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3) RETURNING id',
      values: [id, commentId, owner],
    };

    await this._pool.query(query);
  }

  async deleteLike(payload) {
    const {owner, commentId} = payload;

    const query = {
      text: 'DELETE FROM likes WHERE owner = $1 AND comment_id = $2',
      values: [owner, commentId],
    };

    await this._pool.query(query);
  }

  async getLikeCount(commentId) {
    const query = {
      text: 'SELECT id FROM likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rowCount;
  }
}

module.exports = LikeRepositoryPostgres;
