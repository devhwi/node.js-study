const express = require('express');
const router = express.Router();
const db = require('./db');
const crypto = require('crypto');
const models = require('../models');
const moment = require('moment');

// 회원 가입
router.get('/signup', (req, res) => {
  if(req.session.user_id) {
    res.redirect('/');
  }
  res.render('signup', {
    title: 'Signup'
  });
});

// 로그인
router.get('/login', (req, res) => {
  if(req.session.user_id) {
    res.redirect('/');
  }
  res.render('login', {
    title: 'Login'
  });
});

// 로그인 처리
router.post('/login', (req, res) => {
  var id = req.body.user_id;
  var pw = req.body.user_password;

  // password encryption
  var shasum = crypto.createHash('sha256'); // shasum은 Hash 클래스의 인스턴스입니다.
  shasum.update(pw);
  var encPw = shasum.digest('hex'); // 암호화 완료

  // findOne 특정 컬럼을 가지고 찾는 메서드입니다.
  models.user.findAndCountAll({ where: { id: id
                                       , pass: encPw} })
  .then(function(user) {
    if(user.count == 1) {
      req.session.user_id = id;
      req.session.user_name = user.rows[0].name;
      res.send('<script>alert("안녕하세요.");location.href="/";</script>');
    } else {
      res.send('<script>alert("아이디, 또는 비밀번호를 확인해 주세요.");location.href="/user/login";</script>');
    }
  });
});

// 로그아웃
router.get('/logout', (req, res) => {
  if(req.session.user_id) {
    req.session.destroy(function (err) {
      if(err) console.error('err', err);
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

// 유저 등록 페이지
router.get('/signup', (req, res) => {
  // view 파일을 불러온다.
  res.render('signup', {
    title: 'Signup'
  });
});

// 유저 아이디 중복 확인
router.post('/signup/check_id', (req, res) => {
  models.user.findAndCountAll({where : {id: req.body.id}})
  .then(function(result) {
    if(result.count > 0) {
      req.session
      res.send(false);
    } else {
      res.send(true);
    }
  });
  // var sql = "SELECT COUNT(*) AS count FROM user WHERE user_id = ?";
  // var sqlParams = [user_id];
  // db.query(sql, sqlParams).then((rows) => {
  //   if(rows[0].count > 0){
  //     req.session
  //     res.send(false);
  //   } else {
  //     res.send(true);
  //   }
  // });
});

// 유저 등록 처리
// req.query => GET 방식으로 넘어온 파라미터들
// req.body => POST 방식으로 넘어온 파라미터들
router.post('/signup', (req, res) => {
  // POST 로 넘어온 파라미터들
  var now  = moment().format('YYYY-MM-DD HH:mm:ss');
  var data = { id       : req.body.user_id
             , pass     : req.body.user_password
             , name     : req.body.user_name
             , phone    : req.body.user_phone
             , email    : req.body.user_email
             , birth    : req.body.user_birth
             };

  var shasum = crypto.createHash('sha256'); // 암호화 256으로 샤샤샤
      shasum.update(data.pass);
      data.pass = shasum.digest('hex'); // 암호화 완료

  models.user.create(data)
  .then(function() {
    res.send('<script>alert("가입 완료!");location.href="/";</script>');
  }).catch(function(err) {
    res.send('<script>alert("가입 완료!");</script>');
    console.log(err);
  })
});

router.get('/myInfo', (req, res) => {
  // 사용자 아이디를 통해 세션 유무를 체크합니다
  if(!req.session.user_id) {
    res.send('<script>alert("로그인이 필요합니다.");location.href="/";</script>');
  }

  models.user.findOne({ attributes: ['id', 'name', 'phone', 'email', 'birth']
                      , where: { id: req.session.user_id } })
  .then((rows) => {
    console.log(rows);
    res.render('myInfo', {
      title: 'My Info',
      info: rows
    });
  });
});

router.post('/myInfo', (req, res) => {
  // session check
  if(!req.session.user_id) {
    res.send('<script>alert("로그인이 필요합니다.");location.href="/";</script>');
  }
  // 비밀번호 입력에 대해 확인합니다.
  var user_password = "";
  if(req.body.user_password !== ""
  && req.body.user_password == req.body.user_password_confirm) {
    user_password = req.body.user_password;
    var shasum = crypto.createHash('sha256'); // 암호화 256으로 샤샤샤
        shasum.update(user_password);
        user_password = shasum.digest('hex'); // 암호화 완료
  }
  // POST 로 넘어온 파라미터들
  var data = { id       : req.body.user_id
             , pass     : user_password
             , name     : req.body.user_name
             , phone    : req.body.user_phone
             , email    : req.body.user_email
             , birth    : req.body.user_birth
             };
  if(user_password == "") delete data.pass;
  models.user.update(data, {where: { id: data.id } })
  .then(function() {
    res.send('<script>alert("정보가 수정되었습니다.");location.href="/user/myInfo";</script>');
  });
});

module.exports = router;
