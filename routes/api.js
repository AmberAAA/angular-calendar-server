var express = require('express');
var router = express.Router();
let {insertOne, findOne } = require('../db')
let { isNullOrUndefined } = require('../util')

/* GET home page. */


/* 登录 */
router.get('/login', function (req, res, next) {
  
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
  
  if (isNullOrUndefined(req.query.email) || isNullOrUndefined(req.query.passwd)) {
    res.end(JSON.stringify({state: 2, message: `逗我么？`}))
    return false
  }
  
  findOne({
    col: `user`,
    query: {
      email: req.query.email
    }
  })
    .then(data => {
      if (data.passwd === req.query.passwd) {
        res.end(JSON.stringify({state: 0, data}))
      } else {
        res.end(JSON.stringify({state: 1, message: `密码错误`}))
      }
    })
    .catch(e => {
      console.error(e)
      res.end(JSON.stringify({state: 2, message: `不知道`}))
    })
  
  
})

/* 注册 */
router.post('/login', function(req, res, next) {
  
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
  
  if ( isNullOrUndefined(req.body.email) ) {
    res.end(JSON.stringify({state: 3, message: `邮箱呢?`}))
    return false
  }
  
  insertOne({
    col: 'user',
    doc: req.body
  })
    .then(e => {
      res.end(JSON.stringify({state: 0}))
    })
    .catch(code => {
      if (code === 11000) {
        res.end(JSON.stringify({state: 1, code: code, message: `重复邮箱`}))
      } else {
        res.end(JSON.stringify({state: 2, code: code, message: `未知错误`}))
      }
    })
});

module.exports = router;
