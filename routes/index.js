const express = require('express');
const router = express.Router();
const db = require('./db');
const models = require('../models');
const moment = require('moment');

/* GET home page. */
router.get('/', (req, res, next) => {
  var sess = req.session;
  var today = moment().format('YYYY-MM-DD');
  models.user.findAndCountAll({ attributes: ['idx', 'id', 'name', 'phone', 'email', 'birth']
                              , include: { model: models.attendance
                                         , attributes: ['idx', 'memo',
                                                        [models.Sequelize.fn('date_format', models.Sequelize.col('submit_date'), '%Y-%m-%d %H:%i:%s'), 'submit_date']]
                                         , where: {
                                             date: today
                                         }
                                         , order: ['submit_date', 'ASC']
                              }
  })
  .then((result) => {
    console.log(result.rows);
    res.render('index', {
      title: 'Home'
    , user_id: sess.user_id
    , user_name: sess.user_name
    , moment: moment
    , memo_result: result.rows
    , memo_count: result.count
    });
  }).catch((rows) => {
    // Error
  });
});

module.exports = router;