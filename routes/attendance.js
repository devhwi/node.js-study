const express = require('express');
const router = express.Router();
const db = require('./db');
const models = require('../models');
const moment = require('moment');
const imgur = require('imgur')
const multiparty = require('multiparty');
const fs = require('fs');

// client id setting
imgur.setClientId('bb931910963ab7c');

/**
 * 출석 등록
 */
router.post('/', (req, res) => {
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
    } else {
      console.log("0건이야");
      // imgur 이미지 업로드
      imgur.uploadBase64(req.body.file_name.split(',').pop())
      .then(function(uploadData) {
        console.log(uploadData);
        var data = {
          idx: req.session.user_idx
        , date: moment().format('YYYY-MM-DD')
        , memo: req.body.memo
        , submit_date: moment()
        , file_name: uploadData.data.link
        , delete_hash: uploadData.data.deletehash
        }
        models.attendance.create(data)
        .then(function() {
          res.send('<script>alert("출석 완료!");location.href="/";</script>');
        }).catch(function(err) {
          res.send('<script>alert("오류 발생! 관리자에게 문의하여 주세요.");</script>');
          console.log(err);
        });
      }).catch(function(err) {
        console.log(err);
        res.send('<script>alert("업로드 오류입니다.");</script>');
      });
    }
  }).catch((result) => {
    // Error
  });
});

module.exports = router;