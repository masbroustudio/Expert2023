/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const UsersTableTestHelper = {
  async addUser({
    id = "user-123",
    username = "yudhae",
    password = "secret",
    fullname = "Yudha Elfransyah",
  }) {
    const query = 'INSERT INTO users (id, username, password, fullname) VALUES ($1, $2, $3, $4)';
    const values = [id, username, password, fullname];

    await pool.query(query, values);
  },

  async findUsersById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [id];

    const result = await pool.query(query, values);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM users WHERE 1=1');
  },
};

module.exports = UsersTableTestHelper;
