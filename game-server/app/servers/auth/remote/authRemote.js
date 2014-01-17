/*
 * auth token with uid
 * Process flow: 
 * auth token and get loginData
 * 2013-2014
 * @iamcactus
 */
var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger(__filename);

var loginDao      = require('../../../dao/loginDao');

var tokenService  = require('../../../../../shared/token');
var CODE          = require('../../../../../shared/code');
var commonUtils   = require('../../../../../shared/util/commonUtils');
var tokenConf     = require('../../../../../shared/config/token');

module.exports = function(app) {
	return new Remote(app);
};

var Remote = function(app) {
	this.app = app;
	var session = app.get('session') || {};
	this.secret = session.secret || tokenConf.DEFAULT_SECRET;
	this.expire = session.expire || tokenConf.DEFAULT_EXPIRE;
};

var remote = Remote.prototype;

/**
 * Auth token
 *
 * @param  {String} token token string
 * @return {Object} cb(err, CODE, user)
 */
remote.auth = function(token, cb) {
	var res = tokenService.parse(token, this.secret);
	if (!res) {
		cb(null, CODE.ENTRY.FA_TOKEN_ILLEGAL, null);
		return;
	}

	if (!tokenService.checkExpire(res, this.expire)) {
		cb(null, CODE.ENTRY.FA_TOKEN_EXPIRE, null);
		return;
	}

  // read from slave DB
  var dbhandle_master_s = commonUtils.masterDBR();
  var mysqlc = this.app.get(dbhandle_master_s );

	loginDao.getByUid(mysqlc, res.uid, function(err, user) {
		if (!!err) {
			cb(err, CODE.FAIL, null);
		}
    else if (!user) {
      cb(null, CODE.ENTRY.FA_USER_NOT_EXIST, null);
    }
    else {
		  cb(null, CODE.OK, user);
    }
	});
};
