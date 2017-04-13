const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const engine = require('ejs-locals');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();
const models = require('./models');

// 뷰 엔진 설정
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.engine('ejs', engine);

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 세션 설정
app.use(session({
 secret: 'hwisession',
 resave: false,
 saveUninitialized: true
}));
// 세션을 모든 곳에서 사용 가능하도록 만든다.
app.use(function(req, res, next) {
  // res.locals.user_id = req.session.user_id;
  // res.locals.user_name = req.session.user_name
  // 세션변수 자체를 res.locals.user에 담는다. 사용은 <%=user.user_id%> 와 같이 사용한다.
  res.locals.user = req.session;
  next();
});

// 이것은 경로에 따라 어떤 것을 가져올 지를 정하는 부분
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/users'));

// 404 에러 핸들러 (Page not found)
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 서버 에러 핸들러
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;