/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const RepliesTableTestHelper = {
  async addReply({
    id = "reply-123",
    content = "content reply",
    commentId = "comment-123",
    owner = "user-123",
    date = "2021-08-08T07:59:48.766Z",
  }) {
    const query = 'INSERT INTO replies (id, content, comment_id, owner, date, is_delete) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [id, content, commentId, owner, date, "0"];

    await pool.query(query, values);
  },

  async findRepliesById(id) {
    const query = 'SELECT * FROM replies WHERE id = $1';
    const values = [id];

    const result = await pool.query(query, values);
    return result.rows;
  },

  async deleteReply(id) {
    const query = `UPDATE replies SET is_delete = '1' WHERE id = $1`;
    const values = [id];

    await pool.query(query, values);
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
