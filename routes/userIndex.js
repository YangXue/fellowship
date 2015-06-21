var express = require('express');
var router = express.Router();
var User = require('.././schema/user.js');
var Event = require('.././schema/event.js');
var Topic = require('.././schema/topic.js');
var session = require('express-session');
var fs = require('fs');
var sess;
var sess2;

router.post('/createUser', function (req, res) {
  User.findOne({userName: req.body.userName}, function (err, user){
  	if(err){
  		console.log(err);
  	}
  	else{
  		if(user) {
  			res.json({
  				data:'User already exists.'
  			})
  		}
  		else {
			var user = new User();
			user.userName = req.body.userName;
			user.password = new Buffer(req.body.password).toString('base64');
			user.save(function (error, data) {
				if(error) {
					console.log(error);
				}
				else{
					sess = req.session;
					sess.userName = req.body.userName;
					res.json({
						data:'New User Created.'
					})
				}
			})
  		}
  	}	
  })
});

router.post('/userLogin' , function (req, res) {
		User.findOne({userName: req.body.userName,password: new Buffer(req.body.password).toString('base64')},function (err, user) {
		if(err) {
			console.log(err);
		}
		else {
			if(user) {
				sess = req.session;
				sess.userName = req.body.userName;
				res.json({
					data:req.session.userName,
				});
			}
			else {
				res.statusCode = 500;
				console.log(req.session);
				res.json({
					data: 'User infomation incorrect.'
				})
			}
		}
		res.end('done');
	})
})

router.get('/content', function (req, res) {
	res.json({
		data:req.session.userName
	});
})

router.post('/createEvent', function (req, res){
	var event = new Event();
	event.eventTitle = req.body.eventTitle;
	event.owner = req.body.owner;
	event.details = req.body.details;
	for(var n = 0; n < req.body.image.length; n++) {
		event.image[n] = req.body.image[n];
	}
	var createTime = new Date();
	event.createTime = createTime.toDateString();
	event.status = 'Comming Soon';
	event.save(function (err, data) {
		if(err) {
			console.log(err);
		}
		else{
			console.log(data.image);
		}
		res.end('done');
	})
})

router.get('/futureEvent', function (req, res){
	Event.find({status:'Comming Soon'},function (err,futureEvent) {
		if(err) {
			console.log(err);
			res.end();
		}
		else {
			res.json({
				data: futureEvent
			})
		}
	})
})

router.post('/eventDetails', function (req, res){
	sess2 = req.session;
	sess2.targetId = req.body.eventId;
	console.log(sess2);
	res.end();
})

router.get('/eventDetails', function (req, res){
	if(sess2.targetId) {
		Event.findOne({_id: sess2.targetId},function (err, targetEvent) {
			if(err) {
				console.log(err);
				res.end();
			}
			else {
				res.json({
					data:targetEvent
				})
			}
		})
	}
	else {
		res.statusCode = 500;
	}
})

router.post('/createTopics', function (req, res){
	var topic = new Topic();
	topic.topicTheme = req.body.theme;
	topic.topicContent = req.body.content;
	topic.author = req.body.author;
	topic.status = 'Pending';
	topic.save(function (error,data) {
		if(error){
			console.log(error);
		}
		else {
			console.log('New topic created, need to be approved by administrator.');
		}
		res.end();
	})
})

router.get('/topics', function (req,res){
	Topic.find({status: 'Approved'}, function (err, topics){
		if(err) {
			console.log(err);
			res.end();
		}
		else {
			res.json({
				data:topics
			})
		}
	})
})

router.get('/userProfile', function (req,res){
	if(sess.userName) {
		User.findOne({userName: sess.userName},function (err,profile){
			if(err){
				console.log(err);
				res.end();
			}
			else {
				res.json({
					data:profile
				})
			}
		})
	}
})

router.post('/changePassword', function (req,res){
	if(sess.userName) {
		User.update({userName: sess.userName},{password: new Buffer(req.body.password).toString('base64')},function (err,data){
			if(err){
				console.log(err);
				res.end();
			}
			else{
				res.json({
					data: 'Password changed.'
				})
			}
		})
	}
})

router.post('/updateName', function (req,res){
	if(sess.userName) {
		User.update({userName: sess.userName}, {name: req.body.name},function (err, data) {
			if(err) {
				console.log(err);
				res.end();
			}
			else{
				res.json({
					data: req.body.name
				})
			}
		})
	}
})

router.post('/updateOccuption',function (req, res){
	if(sess.userName) {
		User.update({userName: sess.userName}, {occupation: req.body.occupation},function (err,data){
			if(err){
				console.log(err);
				res.end();
			}
			else{
				res.json({
					data: req.body.occupation
				})
			}
		})
	}
})

router.post('/updateSelfDiscription',function (req,res){
	if(sess.userName) {
		User.update({userName: sess.userName}, {selfDiscription: req.body.selfDiscription},function (err,data){
			if(err){
				console.log(err);
				res.end();
			}
			else{
				res.json({
					data: req.body.occupation
				})
			}
		})
	}
})

router.get('/yourEvent',function (req,res){
	if(sess.userName) {
		Event.find({owner:sess.userName.toUpperCase()}, function (err,events){
			if(err){
				console.log(err);
				res.end();
			}
			else{
				res.json({
					data: events
				})
			}
		})
	}
})

router.get('/yourTopic',function (req,res){
	if(sess.userName) {
		Topic.find({author: sess.userName.toUpperCase()}, function (err,topics){
			if(err){
				console.log(err);
				res.end();
			}
			else{
				res.json({
					data: topics
				})
			}
		})
	}
})

module.exports = router;
