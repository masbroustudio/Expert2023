/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const AuthenticationsTableTestHelper = {
  async addToken(token) {
    const query = "INSERT INTO authentications (token) VALUES ($1)";
    const values = [token];

    await pool.query(query, values);
  },

  async findToken(token) {
    const query = "SELECT token FROM authentications WHERE token = $1";
    const values = [token];
    const result = await pool.query(query, values);

    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM authentications WHERE 1=1");
  },
};

module.exports = AuthenticationsTableTestHelper;
