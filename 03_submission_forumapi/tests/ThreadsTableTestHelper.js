/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadsTableTestHelper = {
  async addThread({
    id = "thread-123",
    title = "Title New Thread",
    body = "Thread Content Here",
    owner = "user-123",
    date = "2021-08-08T07:19:09.775Z",
  }) {
    const query = 'INSERT INTO threads (id, title, body, owner, date) VALUES ($1, $2, $3, $4, $5)';
    const values = [id, title, body, owner, date];

    await pool.query(query, values);
  },

  async findThreadsById(id) {
    const query = 'SELECT * FROM threads WHERE id = $1';
    const values = [id];

    const result = await pool.query(query, values);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
