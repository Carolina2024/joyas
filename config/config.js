const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "sql7777",
  database: "joyas",
  port: 5432,
  allowExitOnIdle: true,
});

module.exports = pool;
