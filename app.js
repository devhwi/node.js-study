const mysql = require('mysql');
const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');

// db connection
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./dbconfig.json', 'utf8'));
const conn = mysql.createConnection({
  "host": config.host,
  "user": config.user,
  "password": config.password,
  "database": config.database
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/assets'));

// POST로 넘어온 데이터를 처리해준다.
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// views 폴더를 static하게 사용 가능하다.

// 첫 번째 인자는 주소, 두 번째는 로딩할 라우트
// 메인페이지
app.get('/', function (req, res) {
  res.send('Hello Node.js!');
});

// 유저 등록
app.get('/signup', function (req, res) {
  // view 파일을 불러온다.
  res.render('signup', {
    title: 'Signup'
  });
});

// 유저 아이디 중복 확인
app.post('/signup/check_id', function (req, res) {
  var user_id = req.body.id;

  var sql = "SELECT COUNT(*) AS count FROM user WHERE user_id = ?";
  var sqlParams = [user_id];
  conn.query(sql, sqlParams, function (err, rows, cols) {
    if(err) {
      console.log(err);
    } else {
      if(rows[0].count > 0){
        res.send(false);
      } else {
        res.send(true);
      }
    }
  });
});

// 유저 등록 처리
// req.query => GET 방식으로 넘어온 파라미터들
// req.body => POST 방식으로 넘어온 파라미터들
app.post('/signup', function (req, res) {
  // POST 로 넘어온 파라미터들
  var user_id = req.body.user_id;
  var user_password = req.body.user_password;
  var user_name = req.body.user_name;
  var user_phone = req.body.user_phone;
  var user_email = req.body.user_email;
  var user_birth = req.body.user_birth;

  // 쿼리 및 쿼리 파라미터
  var sql = "INSERT INTO user VALUES(?, ?, ?, ?, ?, ?)";
  var sqlParams = [user_id, user_password, user_name, user_phone, user_email, user_birth];

  conn.query(sql, sqlParams, function (err, rows, cols) {
    if(err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      // 성공시 메인으로 이동한다.
      res.redirect('/');
    }
  });
});

// 리스너
app.listen(3000, function( err, req, res ) {
  console.log(3000 + ' Connected..');
});