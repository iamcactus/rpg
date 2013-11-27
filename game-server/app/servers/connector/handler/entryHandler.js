var async = require('async');
//var channelUtil = require('../../../util/channelUtil');
var utils = require('../../../util/utils');
var commonUtils = require('../../../../../shared/util/commonUtils');
var CODE = require('../../../../../shared/code');
var logger = require('pomelo-logger').getLogger(__filename);

var loginDao = require('../../../dao/loginDao.js');
var playerDao = require('../../../dao/playerDao.js');
var worldPlayerDao = require('../../../dao/worldPlayerDao.js');

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
 * New client entry game server. Check token and bind user info into session.
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */

// Process flow: 
// step one, auth token and get userData
// step two, kick session
// step three, bind session
// step four, get playerData
// return 
pro.entry = function(msg, session, next) {
	var token = msg.token, self = this;
  var uid, player, playerId;
  var worldId = commonUtils.normalizeWorldId(msg.worldId);

  console.log('enter connector.entry');
  console.log(msg);

	if(!token) {
		next(new Error('invalid entry request: empty token'), {code: CODE.ENTRY.FA_TOKEN_INVALID});
		return;
	}

	async.waterfall([
    // TODO, add world status check.
		function(cb) {
			// auth token, and get userData
			self.app.rpc.auth.authRemote.auth(session, token, cb);
		}, function(code, user, cb) {
			if(code !== CODE.OK) {
				next(null, {code: code});
				return;
			}
			if(!user) {
				next(null, {code: CODE.ENTRY.FA_USER_NOT_EXIST});
				return;
			}
			uid = user.id;
      // one user, one session
			self.app.get('sessionService').kick(uid, cb);
		}, function(cb) {
      console.log('bind uid' + uid);
			session.bind(uid, cb);
    }, function(cb) {
			// query player info by user id
      var dbhandle_s = 'game_master_s';
      var mysqlc = self.app.get(dbhandle_s);
      //var dbhandle_s = commonUtils.worldDBR(msg.worldId);
      //var mysqlc = self.app.get(dbhandle_s);
			if(!mysqlc) {
				next(null, {code: CODE.FAIL});
				return;
			}

      // check if exists player in the world of the uid
      worldPlayerDao.getWorldPlayerByUidAndWorldId(mysqlc, uid, worldId, cb);
		}, function(res, cb) {
      console.log('After worldPlayerDao.getWorldPlayerByUidAndWorldId');
      console.log('res:' + res);
      console.log(session);

      // TODO if there is no further process,
      // following shoule be removed into callback function "function(err, result)"
      // return result there would be more reasonable

			player = res[0];
			if(!player || player.length === 0) {
        // no player data, app/apk should show player generation scene
				next(null, {code: CODE.NONE_PLAYER, player:null});
				return;
			}

      playerId = player.player_id;
      console.log('Got player: ' + playerId);
      // TODO add world ID
			//session.set('serverId', self.app.get('areaIdMap')[player.areaId]);
			session.set('playerId', playerId);
      session.set('worldId', worldId);
			session.on('closed', onUserLeave.bind(null, self.app));
			session.pushAll(cb);
		}
    /*
    , function(cb) {
			self.app.rpc.chat.chatRemote.add(session, player.userId, player.name,
				channelUtil.getGlobalChannelName(), cb);
		}
    */
	], function(err, result) {
		if(err) {
			next(err, {code: CODE.FAIL});
			return;
		}
		next(null, {code: CODE.OK, player: playerId ? playersId : null});
	});
};

var onUserLeave = function (app, session, reason) {
	if(!session || !session.uid) {
		return;
	}

	utils.myPrint('1 ~ OnUserLeave is running ...');
  /*
	app.rpc.area.playerRemote.playerLeave(session, {playerId: session.get('playerId'), instanceId: session.get('instanceId')}, function(err){
		if(!!err){
			logger.error('user leave error! %j', err);
		}
	});
	app.rpc.chat.chatRemote.kick(session, session.uid, null);
  */
};
