const express = require('express');
const router = express.Router();
const db = require('./db');
const models = require('../models');
const moment = require('moment');

/**
 * 출석 등록
 */
router.post('/write', (req, res) => {
  // session check
  if(!req.session.user_id) {
    res.send('<script>alert("로그인이 필요합니다.")</script>')
    res.redirect('/');
  }

  models.attendance.findAndCountAll({
    attributes: ['idx', 'date']
  , where: {
      idx: req.session.user_idx
    , date: moment().format('YYYY-MM-DD')
    }
  }).then((result) => {
    if(result.count > 0) {
      res.send('<script>alert("출석은 하루에 한 번만 가능합니다.~");location.href="/";</script>');
    }
  }).catch((result) => {
    // Error
  });

  var data = {
    idx: req.session.user_idx
  , date: moment().format('YYYY-MM-DD')
  , memo: req.body.memo
  , submit_date: moment()
  }

  models.attendance.create(data)
  .then(function() {
    res.send('<script>alert("출석 완료!");location.href="/";</script>');
  }).catch(function(err) {
    res.send('<script>alert("오류 발생! 관리자에게 문의하여 주세요.");</script>');
    console.log(err);
  });
});

module.exports = router;