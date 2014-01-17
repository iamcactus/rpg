/*
 * web api for registration/login/worldList
 * now web server is express
 * 2013-2014
 * @iamcactus
 */

var express = require('express');
var async = require('async');

var CODE = require('../shared/code');
var Token = require('../shared/token');
var tokenSecret = require('../shared/config/token').DEFAULT_SECRET;
var tokenExpire = require('../shared/config/token').DEFAULT_EXPIRE;
var loginDao = require('./lib/dao/loginDao');
var seqLogin = require('./lib/dao/seqLogin');
var registTrans = require('./lib/trans/registTrans');
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
    res.send({code: CODE.LOGIN.ERR_WRONG_PARAM}); // code:5001
    return;
  }

  // verification
  if ( !regEng.test(msg.name) || !regEng.test(msg.password)) {
    res.send({code: CODE.LOGIN.ERR_WRONG_PARAM}); // code:5001
    return;
  }

  // check deviceInfo exists or not
  loginDao.getByLoginName(mysql_s, msg.name, function (err, user) {
    if (!!err) {
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
    res.send(
      {
        code:   CODE.OK, 
        token:  Token.create(user.uid, Date.now(), tokenSecret), 
        uid: user.uid
      }
    );
  }); // end of loginDao.getByLoginName
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
      // verify token
      if (!!token && regEng.test(token)) {
        var rHash = Token.parse(token, tokenSecret);
        if (!!rHash && !!rHash.uid && rHash.uid === uid && Token.checkExpire(rHash, tokenExpire)) {
          loginDao.getByUid(mysql_s, rHash.uid, callback);
        }
        else {
          callback(null, null);
        }
      }
      else if (!!deviceInfo && regEng.test(deviceInfo)) {
        loginDao.getByDeviceInfo(mysql_s, deviceInfo, callback);
      }
      else {
        callback(null, null);
      }
    },
    worldPlayer: ['loginData', function(callback, arg) {
      if (!!arg.loginData) {
        worldPlayerDao.getWorldPlayerByUid(mysql_s, uid, callback);
      }
      else {
        callback(null, null);
      }
    }]
  }, function(err, results) {
    if (!!err) {
      res.send({code: CODE.FAIL});
      return;
    }
    else {
      console.log('before res for /entry');
      console.log(results);
      if (!!results.loginData) {
        // for security issues, stop publish token here
        // results.loginData['token'] = Token.create(results.loginData.uid, Date.now(), tokenSecret);

        // make data
        res.send(
          {code: CODE.OK,
           res: results
          });
        return;
      }
      else {
        // any else data need here?
        res.send(
          {code: CODE.OK
          });
        return;
      }
    }
  }); // end of async.auto
});

// quick login
app.post('/quick_reg', function(req, res) {
  console.log(req.params);
  var msg = req.body;
  var deviceInfo = msg.deviceInfo;

  // verification
  if (!deviceInfo || !regEng.test(deviceInfo)) {
    res.send({code: CODE.REGIST.ERR_WRONG_PARAM}); //code: 4001
    return;
  }

  // check deviceInfo exists or not
  loginDao.getByDeviceInfo(mysql_s, deviceInfo, function (err, user) {
    if (user) { // exists
      res.send(
        {
          code:   CODE.REGIST.ERR_EXIST, 
          token:  Token.create(user.uid, Date.now(), tokenSecret), 
          uid:    user.uid
        });
      return;
    }
    else {
      // regist
      var loginName   = quickRegUtil.getName(deviceInfo);
      var passwordHash = Token.cryptPass(quickRegUtil.getPasswordHash(deviceInfo));

      async.auto({
        // generate uid
        sequenceId: function(callback) {
          seqLogin.getSequenceID(mysql_s, function(err, sid) {
            if (!!sid) {
              callback(null, sid);
            }
            else {
              callback(err, null);
            }
          });
        },
        // do regist
        registTrans: ['sequenceId', function(callback, result) {
          if (!!result.sequenceId) {
            mysql_m.acquire(function(err, client) {
              registTrans.regist(
                client, 
                result.sequenceId, 
                deviceInfo, 
                loginName, 
                passwordHash, 
                function(err, res) {
                  if (!!err || !!res) {
                    mysql_m.release(client);
                  }
                  callback(err, res);
                }
              );
            }); // end of mysql_m.acquire
          } // end of if
          else {
            callback({code: CODE.FAIL}, null);
          }
        }] // end of registTrans
      }, function(err, results) {
        if (!!err) {
          if (err.code === 1062) {
            res.send({code: CODE.REGIST.ERR_DUPLICATED}); // db duplication
          }
          else {
            res.send({code: CODE.FAIL});
          }
        }
        else {
          if (!!results.sequenceId && !!results.registTrans) {
          console.log('A new user was created! --' + msg.name + ' with uid: ' + results.sequenceId);
          res.send(
            {
              code:   CODE.OK, 
              token:  Token.create(results.sequenceId, Date.now(), tokenSecret), 
              uid:    results.sequenceId
            });
          }
          else {
            res.send({code: CODE.FAIL});
          }
        }
      }); // end of async.auto
    } // end of else
  }); // end of loginDao.getByDeviceInfo
});

// normal registration
app.post('/regist', function(req, res) {
  var msg = req.body;
  if (!msg.name || !msg.password) {
    res.send({code: CODE.REGIST.ERR_WRONG_PARAM});
    return;
  }

  // verification
  if ( !regEng.test(msg.name) || !regEng.test(msg.password)) {
    res.send({code: CODE.REGIST.ERR_WRONG_PARAM}); //code: 4001
    return;
  }

  var deviceInfo = msg.deviceInfo;

  if (!deviceInfo || !regEng.test(deviceInfo)) {
    // set unique value for unvalid deviceInfo
    deviceInfo = new Date().getTime();
  }

  // check deviceInfo exists or not
  loginDao.getByLoginName(mysql_s, msg.name, function (err, user) {
    if (user) { // exists
      console.log(' Got exists ' + user.uid);
      res.send({code: CODE.REGIST.ERR_EXIST});
      return;
    }
    else {
      // regist
      var passwordHash = Token.cryptPass(msg.password);
      async.auto({
        // generate uid
        sequenceId: function(callback) {
          seqLogin.getSequenceID(mysql_s, function(err, sid) {
            if (!!sid) {
              callback(null, sid);
            }
            else {
              callback(err, null);
            }
          });
        },
        // do regist
        registTrans: ['sequenceId', function(callback, result) {
          if (!!result.sequenceId) {
            mysql_m.acquire(function(err, client) {
              registTrans.regist(
                client, 
                result.sequenceId, 
                deviceInfo, 
                msg.name, 
                passwordHash, 
                function(err, res) {
                  if (!!err || !!res) {
                    mysql_m.release(client);
                  }
                  callback(err, res);
                }
              );
            }); // end of mysql_m.acquire
          } // end of if
          else {
            callback({code: CODE.FAIL}, null);
          }
        }] // end of registTrans
      }, function(err, results) {
        if (!!err) {
          if (err.code === 1062) {
            res.send({code: CODE.REGIST.ERR_DUPLICATED}); // db duplication
          }
          else {
            res.send({code: CODE.FAIL});
          }
        }
        else {
          if (!!results.sequenceId && !!results.registTrans) {
          console.log('A new user was created! --' + msg.name + ' with uid: ' + results.sequenceId);
          res.send(
            {
              code:   CODE.OK, 
              token:  Token.create(results.sequenceId, Date.now(), tokenSecret), 
              uid:    results.sequenceId
            });
          }
          else {
            res.send({code: CODE.FAIL});
          }
        }
      }); // end of async.auto
    } // end of else
  }); // end of loginDao.getByLoginName
});

console.log("Web server has started.\nPlease log on http://127.0.0.1:3001/index.html");
app.listen(3001);
