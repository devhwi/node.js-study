const mysql = require('mysql');
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const config = process.env.NODE_ENV == "production" ? "" : JSON.parse(fs.readFileSync(path.join(__dirname, '../dbconfig.json'), 'utf8'));
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);
const using = Promise.using;
const db = require('../models');

const pool = mysql.createPool({
  "host"     : process.env.DB_HOST || config.host,
  "user"     : process.env.DB_USER || config.user,
  "password" : process.env.DB_PASSWORD || config.password,
  "database" : process.env.DB_NAME || config.database,
});

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