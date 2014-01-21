/*
 * pomelo api for get session
 * Process flow: 
 * step one, auth token and get userData
 * step two, kick session
 * step three, bind session
 * step four, get playerData
 * return 
 * 2013-2014
 * @iamcactus
 */
var async = require('async');
var logger = require('pomelo-logger').getLogger(__filename);

var utils       = require('../../../util/utils');
var commonUtils = require('../../../../../shared/util/commonUtils');
var CODE        = require('../../../../../shared/code');
var gameInit    = require('../../../../../shared/gameInit');

var loginDao    = require('../../../dao/loginDao.js');
var playerDao   = require('../../../dao/playerDao.js');
var worldPlayerDao= require('../../../dao/worldPlayerDao');
var playerAllData = require('../../../dao/union/playerAllData');

var Bag         = require('../../../domain/Bag');
var Player      = require('../../../domain/Player');
var PlayerUnit  = require('../../../domain/PlayerUnit');
//var Mission     = require('../../../domain/Mission');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;

	if(!this.app)
		logger.error(app);
};

var pro = Handler.prototype;

/**
 * Check token and bind user info into session.
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Object} return session with uid, with playerId if exists
 */
pro.entry = function(msg, session, next) {
  console.log('enter connector.entry');
  console.log(msg);

	var token = msg.token, self = this;
  var uid;
  var worldId = commonUtils.normalizeWorldId(msg.worldId);

  // db handle
  var dbhandle_master_s = commonUtils.masterDBR();
  var mysqlc_master_s = this.app.get(dbhandle_master_s);

	if (!token) {
		next(null, {code: CODE.ENTRY.FA_TOKEN_INVALID});
		return;
	}

	async.waterfall([
	  // auth token, and get userData
		function(cb) {
			self.app.rpc.auth.authRemote.auth(session, token, cb);
		}, 
    function(code, user, cb) {
      // verify
			if(code !== CODE.OK) {
        // code is set in authRemote
        cb({code: code}, null);
			}
      else {
			  uid = user.uid;
        // one user, one session
			  self.app.get('sessionService').kick(uid, cb);
      }
		},
    function(cb) {
      // get player_id if exists
      worldPlayerDao.getByUidAndWorldId(mysqlc_master_s, uid, worldId, cb);
		}
	], function(err, result) {
		if (!!err || !result) {
      var code = CODE.FAIL;
      if (err.code) {
        code = err.code;
      }
      next(null, {code: code});
			return;
		}
    else {
      // bind and set session
			session.bind(uid);
      session.set('worldId', worldId);

      var playerObj = result[0];
			if (!playerObj || playerObj.length === 0 || !playerObj.player_id) {
        // no player data, app/apk should show player generation scene
		    next(null, {code: CODE.NONE_PLAYER});
        return;
			}
      else {
        var playerId = playerObj.player_id;
			  session.set('playerId', playerId);
		    next(null, {code: CODE.OK, player: playerId});
        return;
      }
    }
	});
};

/**
 * get all info for player
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Object} all info in KN format
 */
pro.playerAllInfo = function(msg, session, next) {
  console.log(msg);
	var self = this;
  //var worldId = commonUtils.normalizeWorldId(msg.worldId);
  var worldId   = session.get('worldId');
  var playerId  = session.get('playerId');

  if (!!playerId) {
    // db handle
    var dbhandle_s = commonUtils.worldDBR(worldId);
    var mysqlc = this.app.get(dbhandle_s);

    playerAllData.get(mysqlc, playerId, function(err, result) {
  		if (!!err || !result) {
        var code = CODE.FAIL;
        if (err.code) {
          code = err.code;
        }
        next(null, {code: code});
  		}
      else {
        var report = _makeReport(result);
  		  next(null, {code: CODE.OK, result: report});
      }
    });
	}
  else {
    // case of no player in game_master.world_player
    next(null, {code: CODE.NONE_PLAYER});
  }
};


/*
var onUserLeave = function (app, session, reason) {
	if(!session || !session.uid) {
		return;
	}

	utils.myPrint('1 ~ OnUserLeave is running ...');
	app.rpc.area.playerRemote.playerLeave(session, {playerId: session.get('playerId'), instanceId: session.get('instanceId')}, function(err){
		if(!!err){
			logger.error('user leave error! %j', err);
		}
	});
	app.rpc.chat.chatRemote.kick(session, session.uid, null);
};
*/
