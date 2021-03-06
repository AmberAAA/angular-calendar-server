var express = require('express');
var router = express.Router();
let {insertOne, findOne, find, deleteOne, updateOne} = require('../db')
let {isNullOrUndefined} = require('../util')
let {Todo, Sensor} = require('../modules')

/* GET home page. */


/* 登录 */
router.get('/login', function (req, res, next) {

	if (isNullOrUndefined(req.query.email) || isNullOrUndefined(req.query.passwd)) {
		res.end(JSON.stringify({state: 2, message: `字段不全`}));
		return false
	}

	findOne({
		col: `user`,
		query: {
			email: req.query.email
		}
	})
		.then(data => {
			if (!!data && data.passwd === req.query.passwd) {
				res.end(JSON.stringify({state: 0, data}))
			} else {
				res.end(JSON.stringify({state: 1, message: `账号或码错误`}))
			}
		})
		.catch(e => {
			console.error(e)
			res.end(JSON.stringify({state: 2, message: `不知道`}))
		})


})

/* 注册 */
router.post('/login', function (req, res, next) {
	if (isNullOrUndefined(req.body.email)) {
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


/* 新建TODO LIST */
router.post('/todo', function (req, res, next) {

	try {
		console.log(req.body)
		let body = new Todo(req.body)
		insertOne({
			col: 'todo',
			doc: {
				...req.body,
				addTime: new Date(),
				modifiedTime: new Date()
			}
		})
			.then(e => res.end(JSON.stringify({state: 0, data: e})))
			.catch(e => res.end(JSON.stringify({state: 1, message: e})))
	} catch (e) {
		res.end(JSON.stringify({state: 2, message: e.message}));
	}
});


/* 查询TODO LIST */
router.get('/todo', function (req, res, next) {
	find({
		col: 'todo',
		query: {
			owner: req.query.id
		}}
		)
			.then(e => res.end(JSON.stringify({state: 0, data: e})))
			.catch(e => res.end(JSON.stringify({state: 1, message: e})))
});

/* 修改TODO LIST */

router.put('/todo', function (req, res, next) {
	updateOne({
		col: 'todo',
		query: {_id: req.query.id},
		update: {$set: {...req.body, modifiedTime: new Date()}},
		option: {returnOriginal: false}
		},
	)
		.then(e => {
			if (e.ok === 1) {
				res.end(JSON.stringify({state: 0, data: e.value}));
			} else {
				res.end(JSON.stringify({state: 1, message: JSON.stringify(e)}));
			}
		})
		.catch(e => res.end(JSON.stringify({state: 1, message: e})))
});

/* 删除TODO LIST */
router.delete('/todo', function (req, res, netx) {
	deleteOne({
		col: 'todo',
		query: {
			_id: req.query._id
		}
	}).then(e => res.end(JSON.stringify({state: ~e + 2})));
});

/* 新建 LIST */
router.post('/sensor', function (req, res, next) {

	try {
		console.log(req.body)
		let body = new Sensor(req.body)
		insertOne({
			col: 'sensor',
			doc: body
		})
			.then(e => res.end(JSON.stringify({state: 0, data: e})))
			.catch(e => res.end(JSON.stringify({state: 1, message: e})))
	} catch (e) {
		res.end(JSON.stringify({state: 2, message: e.message}));
	}
});


module.exports = router;
