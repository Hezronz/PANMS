// test-db-connection.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'db4free.net',
  user: 'db_panmsystem2',
  password: '@Vaati8090002',
  database: 'db_panms'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
  } else {
    console.log('✅ Connected successfully to db4free.net!');
  }
  connection.end();
});
