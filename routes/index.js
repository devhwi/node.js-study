const express = require('express');
const router = express.Router();
const db = require('./db');

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
