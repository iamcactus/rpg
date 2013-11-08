var async = require('async');
//var channelUtil = require('../../../util/channelUtil');
var utils = require('../../../util/utils');
var commonUtils = require('../../../../../shared/util/commonUtils');
var CODE = require('../../../../../shared/code');
var logger = require('pomelo-logger').getLogger(__filename);
var playerDao = require('../../../dao/playerDao.js');

var publicPath = __dirname;
console.log('in connector.entryHandler.entry, publicPath is:' + publicPath);

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
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
pro.entry = function(msg, session, next) {
	var token = msg.token, self = this;

  console.log('enter connector.entry');
  console.log(msg);

	if(!token) {
		next(new Error('invalid entry request: empty token'), {code: CODE.ENTRY.FA_TOKEN_INVALID});
		return;
	}

	var uid, players, player;
	async.waterfall([
		function(cb) {
			// auth token, and get userData
			self.app.rpc.auth.authRemote.auth(session, token, cb);
		}, function(code, user, cb) {
			if(code !== CODE.OK) {
        console.log(' not OK in auth' + code);
				next(null, {code: code});
				return;
			}

			if(!user) {
				next(null, {code: CODE.ENTRY.FA_USER_NOT_EXIST});
				return;
			}
      console.log('Got user');
      console.log(user);
			// query player info by user id
			uid = user.id;
      var worldId = commonUtils.normalizeWorldId(msg.worldId);
      var dbhandle = 'game_world_' + worldId + '_s';
			playerDao.getPlayersByUid(dbhandle, uid, cb);
		}, function(res, cb) {
      console.log('Got player');
			// generate session and register chat status
			players = res;
      console.log('TODO: kick happened here!');
			self.app.get('sessionService').kick(uid, cb);
		}, function(cb) {
      console.log('bind uid' + uid);
			session.bind(uid, cb);
		}, function(cb) {
			if(!players || players.length === 0) {
				next(null, {code: CODE.OK});
        // app/apk should show player generation scene
				return;
			}

			player = players[0];
      console.log('Got player' + player);
      // TODO add world ID
			//session.set('serverId', self.app.get('areaIdMap')[player.areaId]);
			session.set('playerName', player.name);
			session.set('playerId', player.id);
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
  console.log('enter into callback');
  console.log(err);
  console.log(result);
		if(err) {
			next(err, {code: CODE.FAIL});
			return;
		}
    console.log('player' + player);
		next(null, {code: CODE.OK, player: players ? players[0] : null});
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
