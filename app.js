var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/userIndex');
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/test',function (error) {
  if(error){
    console.log(error);
  }
  else console.log('Database connected.');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({secret: 'ssshhhhh', cookie:{maxAge:1000*3600*24*7}}));

app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});

app.listen(8000);


module.exports = app;
