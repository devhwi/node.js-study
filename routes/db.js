const mysql = require('mysql');
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const config = JSON.parse(fs.readFileSync('./dbconfig.json', 'utf8'));
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);
const using = Promise.using;

const pool = mysql.createPool(
  JSON.parse(fs.readFileSync(path.join(__dirname, '../dbconfig.json'), 'utf8'))
);

function getConnection() {
  return pool.getConnectionAsync().disposer((connection)=>{
    return connection.release();
  });
}

function getTransaction() {
  return pool.getConnectionAsync()
  .then((connection)=> {
    return connection.beginTransactionAsync()
    .then(()=> {
      return connection;
    });
  }).disposer((connection, promise)=> {
    let result = promise.isFulfilled() ? connection.commitAsync() : connection.rollbackAsync();
    return result.finally(()=> {
      connection.release();
    });
  });
}

module.exports = {
  query: (sql, values)=> {
    return using(getConnection(), (connection)=> {
      return connection.queryAsync({
        sql: sql,
        values: values
      });
    });
  },
  conn: (callback)=> {
    return using(getConnection(), (connection)=> {
      return callback(connection);
    });
  },
  trans: (callback)=> {
    return using(getTransaction(), (connection)=> {
      return callback(connection);
    });
  }
};

// https://www.npmjs.com/package/mysql#establishing-connections
// connection.connect(function (err) {
//   // 커넥션 오류
//   if (err) {
//     console.error('db 접속 중 오류 발생: ' + err.stack);
//     return;
//   }
//
//   console.log('connected as id ' + connection.threadId);
// });

// connection.query('SELECT * FROM user', function (err, rows, cols) {
//   if (err) throw err;
//   console.log('Test result : ', rows[0].user_id);
//   console.log('rows', rows); // 결과 rows 정보
//   console.log('cols', cols); // 컬럼 정보
// });

// connection.end();