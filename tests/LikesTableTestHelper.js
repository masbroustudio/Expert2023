/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool");

const LikesTableTestHelper = {
  async checkLike({ owner = "user-123", commentId = "comment-123" }) {
    const query = {
      text: "SELECT id FROM likes WHERE owner = $1 AND comment_id = $2",
      values: [owner, commentId],
    };

    await pool.query(query);
  },

  async addLike({
    id = "like-123",
    commentId = "comment-123",
    owner = "user-123",
  }) {
    const query = {
      text: "INSERT INTO likes (id, commentId, owner) VALUES($1, $2, $3)",
      values: [id, commentId, owner],
    };

    await pool.query(query);
  },

  async deleteLike({ owner = "user-123", commentId = "comment-123" }) {
    const query = {
      text: "DELETE FROM likes WHERE owner = $1 AND comment_id = $2",
      values: [owner, commentId],
    };

    await pool.query(query);
  },

  async getLikeCount(commentId) {
    const query = {
      text: "SELECT id FROM likes WHERE comment_id = $1",
      values: [commentId],
    };

    const { rows } = await pool.query(query);
    return rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM likes WHERE 1=1");
  },
};

module.exports = LikesTableTestHelper;
