const express = require('express');
const router = express.Router();
const db = require('./db');
const crypto = require('crypto');

// temp route
router.get('/', (req, res, next) => {
  res.render('login', {
    title: 'Login'
  });
});

// 회원 가입
router.get('/signup', (req, res) => {
  res.render('signup', {
    title: 'Signup'
  });
});

// 로그인
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login'
  });
});

// 로그인 처리
router.post('/login', (req, res) => {
  var id = req.body.user_id;
  var pw = req.body.user_password;

  // password encryption
  var shasum = crypto.createHash('sha512'); // shasum은 Hash 클래스의 인스턴스입니다.
  shasum.update(pw);
  var encPw = shasum.digest('hex'); // 암호화 완료

  var sql = "SELECT user_name, COUNT(*) AS count FROM user ";
      sql+= "WHERE user_id = ? AND user_password = ?";
  var sqlParams = [id, encPw];
  // 쿼리 실행
  db.query(sql, sqlParams).then((rows) => {
    if(rows[0].count == 1) {
      req.session.user_id = id;
      req.session.user_name = rows[0].user_name;
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
  var user_id = req.body.id;

  var sql = "SELECT COUNT(*) AS count FROM user WHERE user_id = ?";
  var sqlParams = [user_id];
  db.query(sql, sqlParams).then((rows) => {
    if(rows[0].count > 0){
      req.session
      res.send(false);
    } else {
      res.send(true);
    }
  });
});

// 유저 등록 처리
// req.query => GET 방식으로 넘어온 파라미터들
// req.body => POST 방식으로 넘어온 파라미터들
router.post('/signup', (req, res) => {
  // POST 로 넘어온 파라미터들
  var user_id = req.body.user_id;
  var user_password = req.body.user_password;
  var user_name = req.body.user_name;
  var user_phone = req.body.user_phone;
  var user_email = req.body.user_email;
  var user_birth = req.body.user_birth;

  var shasum = crypto.createHash('sha512'); // 암호화 512로 샤샤샤
      shasum.update(user_password);
      user_password = shasum.digest('hex'); // 암호화 완료

  // 쿼리 및 쿼리 파라미터
  var sql = "INSERT INTO user VALUES(?, ?, ?, ?, ?, ?)";
  var sqlParams = [user_id, user_password, user_name, user_phone, user_email, user_birth];

  db.query(sql, sqlParams).then((rows) => {
    // 성공시 메인으로 이동한다.
    res.send('<script>alert("가입 완료!");location.href="/";</script>');
  });
});

router.get('/myInfo', (req, res) => {
  // 사용자 아이디를 통해 세션 유무를 체크합니다
  if(!req.session.user_id) {
    res.send('<script>alert("로그인이 필요합니다.");location.href="/";</script>');
  }
  var sess = req.session;
  var user_id = sess.user_id;

  var sql = `SELECT user_id
                  , user_name
                  , user_phone
                  , user_email
                  , user_birth
              FROM user
              WHERE user_id = ?`;
  var sqlParams = [user_id];
  db.query(sql, sqlParams).then((rows) => {
    res.render('myInfo', {
      title: 'My Info',
      info: rows
    });
  })
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
    var shasum = crypto.createHash('sha512'); // 암호화 512로 샤샤샤
        shasum.update(user_password);
        user_password = shasum.digest('hex'); // 암호화 완료
  }
  var user_id = req.body.user_id;
  var user_name = req.body.user_name;
  var user_phone = req.body.user_phone;
  var user_email = req.body.user_email;
  var user_birth = req.body.user_birth;

  var sql = `UPDATE user
             SET user_name = ?
               , user_phone = ?
               , user_email = ?
               , user_birth = ?
             `;
      sql+= user_password !== "" ? `, user_password = ?` : ``;
      sql+= `WHERE user_id = ?`;
  var sqlParams = user_password !== "" ? [user_name, user_phone, user_email, user_birth, user_password, user_id] : [user_name, user_phone, user_email, user_birth, user_id];
  db.query(sql, sqlParams).then((rows) => {
    res.send('<script>alert("정보가 수정되었습니다.");location.href="/user/myInfo";</script>');
  });
});

module.exports = router;
