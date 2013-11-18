var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger(__filename);
var playerDao = require('../../../dao/playerDao');
var playerCardDao = require('../../../dao/playerCardDao');
var playerUnitDao = require('../../../dao/playerUnitDao');

var CODE = require('../../../../../shared/code');
var commonUtils = require('../../../../../shared/util/commonUtils');
var utils = require('../../../util/utils');
var async = require('async');

var nameEngChn = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
  if (!this.app)
    logger.error(app);
};

var pro = Handler.prototype;

/**
 * New role entry game server. 
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Object} player information
 */
pro.createPlayer = function(msg, session, next) {
  console.log(msg);
	var uid = session.uid;
  //var worldId = session.worldId;
  var name = msg.name;
  var sexType = msg.sexType;
  var cardId = msg.cardId;
	var self = this;

  var lead = 10; // TODO, to update it as param 
  // verify name
  if (!nameEngChn.test(name)) {
    next(new Error('invalid name'), {code:CODE.PLAYER.ERR_WRONG_NAME});
    return;
  }

  var playerId;
  var dbhandle_m = commonUtils.worldDBW(msg.worldId);
  // get master DB handle of worldID
  var mysqlc = this.app.get(dbhandle_m);
  console.log(name);
  // check name exists or not
	playerDao.getPlayerByName(mysqlc, name, function(err, player) {
    if (err) {
			next(null, {code: CODE.FAIL, error:err});
			return;
    }

		if (player) {
			next(null, {code: CODE.PLAYER.ERR_NAME_EXIST});
			return;
		}
    console.log('before async: ' + name);
    async.auto({
      // generate a new playerId 
      newPlayerId: function (callback) {
        playerDao.getSequenceID(function(err, id) {
          if (err !== null) {
  			  	logger.error('[register] fail to get playerId for ' + err.stack);
	  			  next(null, {code: CODE.MESSAGE.ERR, error:err});
  	  			return;
          }
          else {
            playerId = id;
            console.log(id + ' is newPlayerId');
            callback(null, id);
          }
        });
      },
      // PlayerData like name,sex_type, etc
      initPlayerData: ['newPlayerId', function (callback) {
        console.log(name);
        console.log('in initPlayerData:' + ' ' + playerId + ' ' + name + ' ' + sexType);
        playerDao.initPlayerData(mysqlc, playerId, name, sexType, callback);
      }],
      // PlayerParam like exp, lv, etc
      initPlayerParam: ['newPlayerId', function (callback) {
        console.log('in initPlayerParam:' + ' ' + playerId + ' ' + lead);
        playerDao.initPlayerParam(mysqlc, playerId, lead, callback);
      }]
      /*
      }],
      // Insert the card into playerCardData
      initPlayerCard: ['newPlayerId', function (callback) {
        playerCardDao.getSequenceID(function(err, serialId) {
          if (err !== null) {

          }
          else {
            playerCardDao.add(serialId, playerId, cardId, 0, 1, 0, 30, callback); 
          }
        }
      }],
      // Insert the initialization itmes into playerItemData
      initPlayerItem: ['newPlayerId', function (callback) {
      }],
      // Insert the card into playerUnitData
      initPlayerUnit: ['newPlayerId', function (callback) {
      }],
      // create player object, return it
      initPlayer: ['playerId', 
        'initPlayerData', 
        'initPlayerParam', 
        'initPlayerCard',
        'initPlayerItem',
        'initPlayerUnit',
        function (callback, res1) {
          callback(res1);
       */
    }, function (err, results) {
    console.log('10101010101');
    console.log(results);
      if (err) {
        logger.error('learn skill error with player: '  + ' stack: ' + err.stack);
				next(null, {code: consts.MESSAGE.ERR, error:err});
        return;
      }
      else {
        next(null, {code: 200, player:results});
        console.log(results);
        return;
      }
    });
	});
};

var afterLogin = function (app, msg, session, user, player, next) {
	async.waterfall([
		function(cb) {
			session.bind(user.id, cb);
		}, 
		function(cb) {
			session.set('username', user.name);
			session.set('areaId', player.areaId);
      session.set('serverId', app.get('areaIdMap')[player.areaId]);
			session.set('playername', player.name);
			session.set('playerId', player.id);
			session.on('closed', onUserLeave);
			session.pushAll(cb);
		}, 
		function(cb) {
			app.rpc.chat.chatRemote.add(session, user.id, player.name, channelUtil.getGlobalChannelName(), cb);
		}
	], 
	function(err) {
		if(err) {
			logger.error('fail to select role, ' + err.stack);
			next(null, {code: consts.MESSAGE.ERR});
			return;
		}
		next(null, {code: consts.MESSAGE.RES, user: user, player: player});
	});
};

var onUserLeave = function (session, reason) {
	if(!session || !session.uid) {
		return;
	}

	utils.myPrint('2 ~ OnUserLeave is running ...');
	var rpc= pomelo.app.rpc;
	rpc.area.playerRemote.playerLeave(session, {playerId: session.get('playerId'), areaId: session.get('areaId')}, null);
	rpc.chat.chatRemote.kick(session, session.uid, null);
};
