"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var config    = env == "production" ? "" : JSON.parse(fs.readFileSync(path.join(__dirname, '../sequelize.config.json'), 'utf8'));
var cf = { "username": process.env.DB_USER     || config.username
         , "password": process.env.DB_PASSWORD || config.username
         , "database": process.env.DB_NAME     || config.database
         , "host"    : process.env.DB_HOST     || config.host
         , "port"    : process.env.DB_PORT     || config.port
         , "dialect" : process.env.DB_TYPE     || config.dialect
         , "pool"    : { "max": 5, "min": 0, "idle": 10000 }
         }
var sequelize = new Sequelize(process.env.DB_NAME     || config.database
                            , process.env.DB_USER     || config.username
                            , process.env.DB_PASSWORD || config.password, cf);
var db        = {};

fs
.readdirSync(__dirname)
.filter(function(file) {
  return (file.indexOf(".") !== 0) && (file !== "index.js");
})
.forEach(function(file) {
  var model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;