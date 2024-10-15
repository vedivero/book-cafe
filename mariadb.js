const mariadb = require('mysql2');

const conn = mariadb.createConnection({
   host: '127.0.0.1',
   user: 'root',
   password: 'root',
   database: 'bookCafe',
   dateStrings: true,
});

module.exports = conn;
