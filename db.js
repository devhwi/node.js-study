const mysql = require('mysql');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./dbconfig.json', 'utf8'));

const connection = mysql.createConnection({
  "host": config.host,
  "user": config.user,
  "password": config.password,
  "database": config.database
});

// https://www.npmjs.com/package/mysql#establishing-connections
connection.connect(function (err) {
  // 커넥션 오류
  if (err) {
    console.error('db 접속 중 오류 발생: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

// connection.query('SELECT * FROM user', function (err, rows, cols) {
//   if (err) throw err;
//   console.log('Test result : ', rows[0].user_id);
//   console.log('rows', rows); // 결과 rows 정보
//   console.log('cols', cols); // 컬럼 정보
// });

// connection.end();