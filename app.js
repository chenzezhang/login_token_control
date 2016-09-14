var express = require('express');
var path = require('path');
var fs = require('fs');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var auth = require('./src/oauth2/oaut2-oauth').oa;

var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());


//redis 是否连接
var redis = require('./src/redis/redis-server');



redis.on('error', function(err) {
  console.log("\n哈喽：\n亲爱的小伙。\n麻烦开下天眼（- 0 -）确认redis有没有在运动！！！\n");
  redis.disconnect();
  throw err;
});

var appRoot = path.resolve(module.filename);

var addepath = path.resolve('api/v4/apiv4.js');
var routAdress = require('./src/middlewares/callback');

if (fs.existsSync(addepath)) {
  var router = express.Router();
  require(addepath)(router, auth, routAdress);
  app.use(router);
}

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.json(err);
});



// app.use(require('oauth2-errorhandlers')(os));

module.exports = app;