var express = require('express');
var router = express.Router();

router.get('/now', function(req, res, next) {
  // session check
  if(!req.session.user_id) {
    res.send('<script>alert("로그인이 필요합니다.");location.href="/"</script>')
  }
  res.render('chat', { title: 'Chat' });
});

module.exports = router;