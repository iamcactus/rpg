var express = require('express');
var async = require('async');

var CODE = require('../shared/code');
var Token = require('../shared/token');
var tokenSecret = require('../shared/config/token').DEFAULT_SECRET;
var tokenExpire = require('../shared/config/token').DEFAULT_EXPIRE;
var loginDao = require('./lib/dao/loginDao');
var worldDao = require('./lib/dao/worldDao');
var worldPlayerDao = require('./lib/dao/worldPlayerDao');

/*
var log4js = require('log4js');
log4js.configure('./config/log4js.json', {});
//var logger = log4js.getLogger('node-log', {'nolog': /\.(js|gif|jpe?g|png)$/});
var logger = log4js.getLogger('node-log'); // TODO add nolog
*/

var app = express.createServer();

//Init mysql
// mysql_m master handle, mysql_s slave handle
var dbclient = require('./lib/dao/mysql/mysql');
var dbhandle_m = 'game_master_m';
var dbhandle_s = 'game_master_s';
var mysql_m = new dbclient(app, dbhandle_m).pool;
var mysql_s = new dbclient(app, dbhandle_s).pool;
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

  // log
  /*
  app.use(function(req, res, next) {
    logger.info([
      req.headers['x-forwarded-for'] ||
      new Date().toLocaleString(),
      req.method,
      req.url,
      res.statusCode,
      req.headers.referer || '-',
      req.headers['user-agent'] || '-'
      ].join('\t')
    );
    next();
  });
  */
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
  console.log(msg);
  if (!msg.name || !msg.password) {
    alert(11);
    res.send({code: CODE.LOGIN.ERR_WRONG_PARAM}); // code:5001
    return;
  }

  if ( !regEng.test(msg.name) || !regEng.test(msg.password)) {
    alert(12);
    res.send({code: CODE.LOGIN.ERR_WRONG_PARAM}); // code:5001
    return;
  }

  // check deviceInfo exists or not
  loginDao.getLoginDataByLoginName(mysql_s, msg.name, function (err, user) {
    if (err) {
      res.send({code: CODE.FAIL});
      return;
    }
    if (!user) {
      res.send({code: CODE.LOGIN.ERR_NOT_EXIST});
      return;
    }

    var passwordHash = Token.cryptPass(msg.password);
    if (user.psw != passwordHash) {
      res.send({code: CODE.LOGIN.ERR_WRONG_PASSWORD}); // code: 5003
      return;
    }
    console.log(msg.name + ' login! userId:' + user.uid);
    res.send({code: CODE.OK, token: Token.create(user.uid, Date.now(), tokenSecret), uid: user.uid});
  });
});

// app/apk first request, 
// timing is after version checking, before regist/login
// req includes deviceInfo, token, uid
// return world list and account info if exist
app.post('/entry', function(req, res) {
  console.log(req.body);
  var msg         = req.body;
  var deviceInfo  = msg.deviceInfo;
  var uid         = msg.uid;   // null if new installed
  var token       = msg.token; // null if new installed

  async.auto({
    worldData: function(callback) {
      worldDao.getWorldList(mysql_s, callback);
    },
    loginData: function(callback) {
      if (!!token && regEng.test(token)) {
        var rHash = Token.parse(token, tokenSecret);
        if (!!rHash && !!rHash.uid && rHash.uid === uid && Token.checkExpire(rHash, tokenExpire)) {
          loginDao.getLoginDataByUid(mysql_s, rHash.uid, callback);
        }
        else {
          callback(null);
        }
      }
      else if (!!deviceInfo && regEng.test(deviceInfo)) {
        loginDao.getLoginDataByDeviceInfo(mysql_s, deviceInfo, callback);
      }
      else {
        callback(null);
      }
    },
    worldPlayer: ['loginData', function(callback, arg) {
      if (!!arg.loginData) {
        worldPlayerDao.getWorldPlayerByUid(mysql_s, uid, callback);
      }
      else {
        callback(null);
      }
    }]
  }, function(err, results) {
    if (err) {
      res.send({code: CODE.FAIL});
      return;
    }
    else {
      if (!!results.loginData) {
        // for security issues, stop publish token here
        // results.loginData['token'] = Token.create(results.loginData.uid, Date.now(), tokenSecret);
      }

      console.log('before res for /entry');
      console.log(results);
      res.send({code: CODE.OK,
                res: results});
      return;
    }
  });
});

// quick login
app.post('/quick_reg', function(req, res) {
  console.log(req.params);
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
      res.send({code: CODE.REGIST.ERR_EXIST, 
                token: Token.create(user.uid, Date.now(), tokenSecret), 
                uid: user.uid});
      return;
    }
    else {
      // regist
      var loginName   = quickRegUtil.getName(deviceInfo);
      var passwordHash = Token.cryptPass(quickRegUtil.getPasswordHash(deviceInfo));
      loginDao.createUser(mysql_m, deviceInfo, loginName, passwordHash, function(err, user) {
        if (err || !user) {
          if (err && err.code === 1062) {
            res.send({code: CODE.REGIST.ERR_DUPLICATED});
          } else {
            res.send({code: CODE.FAIL});
          }
        } else {
          console.log('A new user was created! --' + msg.name + user.uid);
          res.send({code: CODE.OK, token: Token.create(user.uid, Date.now(), tokenSecret), uid: user.uid});
        }
      });
    }
  });
});

app.post('/regist', function(req, res) {
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

  // check deviceInfo exists or not
  loginDao.getLoginDataByLoginName(mysql_m, msg.name, function (err, user) {
    if (user) { // exists
      console.log(' Got exists ' + user.uid);
      res.send({code: CODE.REGIST.ERR_EXIST});
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
            res.send({code: CODE.FAIL});
          }
        } else {
          console.log('A new user was created! --' + msg.name);
          res.send({code: CODE.OK, token: Token.create(user.uid, Date.now(), tokenSecret), uid: user.uid});
        }
      });
    }
  });
});

console.log("Web server has started.\nPlease log on http://127.0.0.1:3001/index.html");
app.listen(3001);
