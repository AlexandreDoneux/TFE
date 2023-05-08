const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'mariadb',
  user: 'root',
  password: 'root',
  database: 'my_database',
  connectionLimit: 10
});

module.exports = pool;