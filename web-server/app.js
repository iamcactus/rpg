var express = require('express');

var CODE = require('../shared/code');
var Token = require('../shared/token');
var secret = require('../shared/config/session').secret;
var loginDao = require('./lib/dao/loginDao');

var app = express.createServer();
var mysql = require('./lib/dao/mysql/mysql');

// mysql handle
var dbhandle_m = 'game_master_m';
var dbhandle_s = 'game_master_s';

//Init mysql
var mysql_m = mysql.init(app, dbhandle_m);
var mysql_s = mysql.init(app, dbhandle_s);

var publicPath = __dirname + '/public';

// quick regist
var quickRegUtil = require('./lib/util/quickRegUtil.js');
var regEngChn = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
var regEng = /^[a-zA-Z0-9_]+$/;
var regNum = /^[0-9]+$/;

var util = require('util');

app.configure(function(){
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(app.router);

	app.set('view engine', 'jade');
	app.set('views', publicPath);
	app.set('view options', {layout: false});
	app.set('basepath', publicPath);
});

app.configure('development', function(){
	app.use(express.static(publicPath));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	var oneYear = 31557600000;
	app.use(express.static(publicPath, { maxAge: oneYear }));
	app.use(express.errorHandler());
});

app.post('/login', function(req, res) {
  var msg = req.body;
  if (!msg.name || !msg.password) {
    res.send({code: CODE.REGIST.ERR_WRONG_PARAM});
    return;
  }

  if ( !regEng.test(msg.name) || !regEng.test(msg.password)) {
    res.send({code: CODE.REGIST.ERR_WRONG_PARAM}); //code: 4001
    return;
  }

  // check deviceInfo exists or not
  loginDao.getLoginDataByLoginName(mysql_s, msg.name, function (err, user) {
    if (err) {
      res.send({code: 500});
      return;
    }
    if (!user) {
      res.send({code: CODE.LOGIN.ERR_NOT_EXIST});
      return;
    }

    var passwordHash = Token.cryptPass(msg.password);
    if (user.psw != passwordHash) {
      res.send({code: CODE.LOGIN.ERR_WRONG_PARAM});
      return;
    }
    console.log(user);
    console.log(msg.name + ' login! userId:' + user.id);
    res.send({code: 200, token: Token.create(user.id, Date.now(), secret), uid: user.id});
  });
});

// quick login
app.post('/quick_reg', function(req, res) {
  console.log('req.params');
  var msg = req.body;
  var deviceInfo = msg.deviceInfo;

  // deviceInfo is must in case of quickInfo
  if (!deviceInfo || !regEng.test(deviceInfo)) {
    res.send({code: CODE.REGIST.ERR_WRONG_PARAM}); //code: 4001
    return;
  }

  // check duplicated request
  /*
  var memcached = self.app.get('memcached');
  memcached.get(chkKey, function(err, res) {
    if (err) {
      //nothing
    }
    if (res) {
      next(new Error('alreay process this request'),
          {code: 501});
      return;
    }
  });
  */

  // check deviceInfo exists or not
  loginDao.getLoginDataByDeviceInfo(mysql_m, deviceInfo, function (err, user) {
    if (user) { // exists
      console.log(' Got exists ' + user.id);
      res.send({code: CODE.REGIST.ERR_EXIST, 
                token: Token.create(user.id, Date.now(), secret), 
                uid: user.id});
      return;
      console.log('check if come here');
    }
    else {
      // regist
      var loginName   = quickRegUtil.getName(deviceInfo);
      var passwordHash = Token.cryptPass(quickRegUtil.getPasswordHash(deviceInfo));
      loginDao.createUser(dbhandle_m, deviceInfo, loginName, passwordHash, function(err, user) {
        if (err || !user) {
          console.error(err);
          if (err && err.code === 1062) {
            res.send({code: CODE.REGIST.ERR_DUPLICATED});
          } else {
            res.send({code: 500});
          }
        } else {
          console.log('A new user was created! --' + msg.name + user.id);
          res.send({code: 200, token: Token.create(user.id, Date.now(), secret), uid: user.id});
        }
      });
    }
  });
});

app.post('/regist', function(req, res) {
  console.log('req.params');
  var msg = req.body;
  if (!msg.name || !msg.password) {
    res.send({code: CODE.REGIST.ERR_WRONG_PARAM});
    return;
  }

  if ( !regEng.test(msg.name) || !regEng.test(msg.password)) {
    res.send({code: CODE.REGIST.ERR_WRONG_PARAM}); //code: 4001
    return;
  }

  var deviceInfo = msg.deviceInfo;
  console.log('di:' + deviceInfo);
  if ( !deviceInfo || !regEng.test(deviceInfo)) {
    deviceInfo = msg.name; // deviceInfo is unique, so set unvalid deviceInfo to msg.name
  }

  console.log('di:' + deviceInfo);
  // check deviceInfo exists or not
  loginDao.getLoginDataByLoginName(mysql_m, msg.name, function (err, user) {
    if (user) { // exists
      console.log(' Got exists ' + user.id);
      res.send({code: CODE.REGIST.ERR_DUPLICATED});
      return;
    }
    else {
      // regist
      var passwordHash = Token.cryptPass(msg.password);
      loginDao.createUser(mysql_m, deviceInfo, msg.name, passwordHash, function(err, user) {
        if (err || !user) {
          console.error(err);
          if (err && err.code === 1062) {
            res.send({code: CODE.REGIST.ERR_DUPLICATED});
          } else {
            res.send({code: 500});
          }
        } else {
          console.log('A new user was created! --' + msg.name);
          res.send({code: 200, token: Token.create(user.id, Date.now(), secret), uid: user.id});
        }
      });
    }
  });
});

console.log("Web server has started.\nPlease log on http://127.0.0.1:3001/index.html");
app.listen(3001);
