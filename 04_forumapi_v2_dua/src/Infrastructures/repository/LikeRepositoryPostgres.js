const LikeRepository = require('../../Domains/likes/LikeRepository');

class CommentRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(likePayload) {
    const {
      commentId, userId,
    } = likePayload;
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO like_comments VALUES ($1, $2, $3)',
      values: [id, userId, commentId],
    };

    await this._pool.query(query);
  }

  async removeLike(likePayload) {
    const {
      commentId, userId,
    } = likePayload;
    const query = {
      text: 'DELETE FROM like_comments WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    await this._pool.query(query);
  }

  async verifyLiked(likePayload) {
    const {
      commentId, userId,
    } = likePayload;
    const query = {
      text: 'SELECT id FROM like_comments WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async countLikes(commentId) {
    const query = {
      text: 'SELECT COUNT(*) FROM like_comments WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return Number(result.rows[0].count);
  }
}

module.exports = CommentRepositoryPostgres;
