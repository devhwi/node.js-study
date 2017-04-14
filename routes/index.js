const express = require('express');
const router = express.Router();
const db = require('./db');
const models = require('../models');

/* GET home page. */
router.get('/', (req, res, next) => {
  var sess = req.session;

  res.render('index', {
    title: 'Home',
    user_id: sess.user_id,
    user_name: sess.user_name
  });
});

module.exports = router;
