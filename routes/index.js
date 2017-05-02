const express = require('express');
const router = express.Router();
const db = require('./db');
const models = require('../models');
const moment = require('moment');

/* GET home page. */
router.get('/:date?', (req, res, next) => {
  // today or get
  var getDate = req.params.date ? moment(req.params.date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
  console.log(getDate);

  // 날짜 체크 -> get 으로 넘어온 날짜가 오늘보다 클 수 없다.
  if(moment(req.params.date).isAfter(moment(), 'days')) {
    res.send('<script>alert("오늘 날짜보다 클 수 없습니다.");location.href="/"</script>');
  }

  var sess = req.session;
  models.user.findAndCountAll({ attributes: ['idx', 'id', 'name', 'phone', 'email', 'birth']
                              , include: { model: models.attendance
                                         , attributes: [ 'idx', 'memo', 'file_name',
                                                         [ models.Sequelize.fn('date_format'
                                                         , models.Sequelize.col('submit_date'), '%Y-%m-%d %H:%i:%s')
                                                         , 'submit_date']
                                                       ]
                                         , where: {
                                             date: getDate
                                         }
                                         , order: ['submit_date', 'ASC']
                              }
  }).then((result) => {
    res.render('index', {
      title: 'Home'
    , user_id: sess.user_id
    , user_name: sess.user_name
    , moment: moment
    , memo_result: result.rows
    , memo_count: result.count
    , date: getDate
    , yesterday: moment(getDate).add(-1, 'days').format('YYYY-MM-DD')
    , tomorrow: moment(getDate).add(1, 'days').format('YYYY-MM-DD')
    });
  }).catch((err) => {
    console.log('Error ! : ' + err);
  });
});

module.exports = router;