/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool");

const RepliesTableTestHelper = {
  async addReply({
    id = "reply-123",
    content = "Reply from mars",
    date = new Date(),
    owner = "user-123",
    comment_id = "comment-123",
  }) {
    const query = {
      text: "INSERT INTO replies (id, content, date, owner, comment_id) VALUES($1, $2, $3, $4, $5)",
      values: [id, content, date, owner, comment_id],
    };

    await pool.query(query);
  },

  async verifyReplyOwner({ replyId = `reply-123`, owner = `user-123` }) {
    const query = {
      text: "SELECT owner FROM replies WHERE id = $1",
      values: [replyId],
    };

    const { rows } = await pool.query(query);
    if (!rows.length) {
      throw new NotFoundError("comment tidak ditemukan");
    } else if (rows[0].owner !== owner) {
      throw new AuthorizationError("Missing authentication");
    }
  },

  async getReplyByCommentId(commentId = "comment-123") {
    const query = {
      text: `
              SELECT replies.id,
              CASE WHEN replies.is_delete = true THEN '**balasan telah dihapus**' ELSE replies.content END AS content,
              replies.date,
              users.username
              FROM replies
              LEFT JOIN users ON replies.owner = users.id
              WHERE replies.comment_id = $1
              ORDER BY replies.date ASC
              `,
      values: [commentId],
    };

    const { rows } = await pool.query(query);
    return rows;
  },

  async deleteReply({ replyId = "reply-123", commentId = "comment-123" }) {
    const query = {
      text: "UPDATE replies SET is_delete = true WHERE id = $1 AND comment_id = $2",
      values: [replyId, commentId],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query("DELETE FROM replies WHERE 1=1");
  },
};

module.exports = RepliesTableTestHelper;
