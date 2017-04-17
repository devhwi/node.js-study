const express = require('express');
const router = express.Router();
const db = require('./db');
const models = require('../models');

/* GET home page. */
router.get('/', (req, res, next) => {
  var sess = req.session;
  models.user.findOne({ attributes: ['user_id', 'user_name', 'user_phone', 'user_email', 'user_birth']
                      , where: { user_id: req.session.user_id }
                      , include: { model: models.attendance } })
  .then((rows) => {
    res.json(rows);
  }).catch((rows) => {
    // Error
  });
  res.render('index', {
    title: 'Home',
    user_id: sess.user_id,
    user_name: sess.user_name
  });
});

module.exports = router;
