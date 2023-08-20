/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadsTableTestHelper = {
  async addThread({
    id = "thread-123",
    title = "thread 123",
    body = "hello thread 123",
    date = new Date(),
    owner = "user-123",
  }) {
    const query = {
      text: "INSERT INTO threads (id, title, body, date, owner) VALUES($1, $2, $3, $4, $5)",
      values: [id, title, body, date, owner],
    };

    await pool.query(query);
  },

  async deleteThreadComment({ id = "comment-123" }) {
    const query = {
      text: "DELETE FROM comments WHERE id = $1 RETURNING id",
      values: [id],
    };

    const { rowCount } = await pool.query(query);
    return rowCount;
  },

  async getThread({ id = "thread-123" }) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
  },
};

module.exports = ThreadsTableTestHelper;
