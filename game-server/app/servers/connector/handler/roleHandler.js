var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger(__filename);

var playerDao = require('../../../dao/playerDao');
var playerParam = require('../../../dao/playerParam');
var playerCardDao = require('../../../dao/playerCardDao');
var playerUnitDao = require('../../../dao/playerUnitDao');
var worldPlayerDao = require('../../../dao/worldPlayerDao');
var playerMisssionLog = require('../../../dao/playerMissionLog');

var CODE = require('../../../../../shared/code');
var EVOLVECONF = require('../../../../../shared/evolveConf');
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
	//var uid = session.uid; // TODO uncomment this
  var uid = msg.uid; // just for browser develop style
  //var worldId = session.worldId;
  var worldId = msg.worldId;
  var name = msg.name;
  var sexType = msg.sexType;
  var cardId = msg.cardId;
  var playerCardId;
	var self = this;

  var lead = 10; // TODO, to update it as param 
  // verify name
  if (!nameEngChn.test(name)) {
    next(new Error('invalid name'), {code:CODE.PLAYER.ERR_WRONG_NAME});
    return;
  }

  var playerId;
  var dbhandle_m = commonUtils.worldDBW(worldId);
  // get master DB handle of worldID
  var mysqlc = this.app.get(dbhandle_m);
  var mysqlc_master = this.app.get('game_master_m');

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
      newPlayerId: function(callback) {
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
      // insert into game_master.world_player
      createWorldPlayer: ['newPlayerId', function(callback) {
        console.log('in createWorldData:' + ' ' + uid + ' ' + playerId + ' ' + worldId);
        worldPlayerDao.createWorldPlayer(mysqlc_master, uid, worldId, playerId, callback);
      }],
      // PlayerData like name,sex_type, etc
      initPlayerData: ['newPlayerId', function(callback) {
        console.log(name);
        console.log('in initPlayerData:' + ' ' + playerId + ' ' + name + ' ' + sexType);
        playerDao.initPlayerData(mysqlc, playerId, name, sexType, callback);
      }],
      // PlayerParam like exp, lv, etc
      initPlayerParam: ['newPlayerId', function(callback) {
        console.log('in initPlayerParam:' + ' ' + playerId + ' ' + lead);
        playerParam.init(mysqlc, playerId, lead, callback);
      }],
      // PlayerMissionLog
      initPlayerMissionLog: ['newPlayerId', function(callback) {
        console.log('in initPlayerMissionLog:' + ' ' + playerId + ' ');
        // missionDataId:1, clearNum:0
        playerMissionLog.insert(mysqlc, playerId, 1, 0, callback);
      }],
      // Insert the card into playerCardData
      initPlayerCard: ['newPlayerId', function(callback) {
        playerCardDao.getSequenceID(mysqlc, function(err, serialId) {
          console.log('in initPlayerCard');
          console.log(serialId);
          if (err !== null) {
    				next(null, {code: CODE.FAIL, error:err});
          }
          else {
            // id, playerId, cardId, exp:0, level:1, evolvedCnt:0, maxLevel:defined in EVOLVECONF, cb
            console.log('in initPlayerCard' + serialId);
            playerCardDao.add(mysqlc, serialId, playerId, cardId, 0, 1, 0, EVOLVECONF.THREE.INITIAL_LV, callback);
            playerCardId = serialId;
          }
        });
      }],
      /*
      // Insert the initialization itmes into playerItemData
      initPlayerItem: ['newPlayerId', function(callback) {
      }],
      */
      // Insert the card into playerUnitData
      initPlayerUnit: ['newPlayerId', 'initPlayerCard', function(callback) {
        // playerId, positionId, playerCardId
        playerUnitDao.add(mysqlc, playerId, 1, playerCardId, callback); 
      }]
    }, function(err, results) {
      console.log('10101010101');
      console.log(results);
      if (err) {
        logger.error('error with player creation: '  + ' err: ' + err.message);
				next(null, {code: CODE.FAIL, error:err});
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
