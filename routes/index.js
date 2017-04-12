const express = require('express');
const router = express.Router();
const db = require('./db');
const models = require('../models');

/* GET home page. */
router.get('/', (req, res, next) => {
  var sess = req.session;

  // findOne 특정 컬럼을 가지고 찾는 메서드입니다.
  models.user.findOne({ where: {user_id: sess.user_id} })
  .then(function(user) {
    console.log("쿼리 성공");
    console.log(user);
    // project will be the first entry of the Projects table with the title 'aProject' || null
  })

  res.render('index', {
    title: 'Home',
    user_id: sess.user_id,
    user_name: sess.user_name
  });
});

module.exports = router;
