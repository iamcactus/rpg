var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger(__filename);
var tokenService = require('../../../../../shared/token');
var loginDao = require('../../../dao/loginDao');
var CODE = require('../../../../../shared/code');

var DEFAULT_SECRET = 'pomelo_session_secret';
var DEFAULT_EXPIRE = 15 * 60 * 1000;	// default session expire time: 15 minutes

module.exports = function(app) {
	return new Remote(app);
};

var Remote = function(app) {
	this.app = app;
	var session = app.get('session') || {};
	this.secret = session.secret || DEFAULT_SECRET;
	this.expire = session.expire || DEFAULT_EXPIRE;
};

var remote = Remote.prototype;

/**
 * Auth token and check whether expire.
 *
 * @param  {String}   token token string
 * @param  {Function} cb
 * @return {Void}
 */
remote.auth = function(token, cb) {
	var res = tokenService.parse(token, this.secret);
	if(!res) {
		cb(null, CODE.ENTRY.FA_TOKEN_ILLEGAL);
		return;
	}

	if(!tokenService.checkExpire(res, this.expire)) {
		cb(null, CODE.ENTRY.FA_TOKEN_EXPIRE);
		return;
	}

  // read from slave DB
  var dbhandle_s = 'game_master_s';
  var mysqlc = this.app.get(dbhandle_s);

	loginDao.getLoginDataByUid(mysqlc, res.uid, function(err, user) {
		if(err) {
			cb(err.message, err.code, null);
			return;
		}

    // there is a check for null user
    // ex. connector.entryHandler.entry
    // so pass checking here.

		cb(null, CODE.OK, user);
	});
};
