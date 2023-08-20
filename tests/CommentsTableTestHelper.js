/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async addComment({
    id = "comment-123",
    content = "sebuah content",
    date = new Date(),
    owner = "user-123",
    thread_id = "thread-123",
  }) {
    const query = {
      text: "INSERT INTO comments (id, content, date, owner, thread_id) VALUES($1, $2, $3, $4, $5)",
      values: [id, content, date, owner, thread_id],
    };

    await pool.query(query);
  },

  async verifyCommentOwner({ commentId = `comment-123`, owner = `user-123` }) {
    const query = {
      text: "SELECT owner FROM comments WHERE id = $1",
      values: [commentId],
    };

    const { rows } = await pool.query(query);
    if (!rows.length) {
      throw new NotFoundError("Comment tidak ditemukan");
    } else if (rows[0].owner !== owner) {
      throw new AuthorizationError("Missing authentication");
    }
  },

  async getCommentByThreadId(threadId) {
    const query = {
      text: `
        SELECT comments.id,
          users.username,
          comments.date,
          CASE WHEN comments.is_delete = true THEN '**komentar telah dihapus**' ELSE comments.content END AS content
        FROM comments
          LEFT JOIN users ON comments.owner = users.id
        WHERE comments.thread_id = $1
        ORDER BY comments.date ASC
      `,
      values: [threadId],
    };

    const { rows } = await pool.query(query);
    return rows;
  },

  async verifyCommentOwner({ commentId = `comment-123`, owner = `user-123` }) {
    const query = {
      text: "SELECT owner FROM comments WHERE id = $1",
      values: [commentId],
    };

    const { rows } = await this._pool.query(query);
    if (!rows.length) throw new NotFoundError("comment tidak ditemukan");
    if (rows[0].owner !== owner)
      throw new AuthorizationError("Missing authentication");
  },

  async deleteComment({ commentId = "comment-123", threadId = "thread-123" }) {
    const query = {
      text: "UPDATE comments SET is_delete = true WHERE id = $1 AND thread_id = $2",
      values: [commentId, threadId],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

module.exports = CommentsTableTestHelper;
