/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikeTableTestHelper = {
  async addLike({
    id = 'like-123',
    commentId,
    userId = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO like_comments VALUES($1, $2, $3)',
      values: [id, userId, commentId],
    };

    await pool.query(query);
  },

  async removeLike(userId, commentId) {
    const query = {
      text: 'DELETE FROM like_comments WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    await pool.query(query);
  },

  async countLikes(commentId) {
    const query = {
      text: 'SELECT COUNT(*) FROM like_comments WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await pool.query(query);
    return Number(result.rows[0].count);
  },

  async cleanTable() {
    await pool.query('DELETE FROM like_comments WHERE 1=1');
  },
};

module.exports = LikeTableTestHelper;
