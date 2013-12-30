var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger(__filename);
var mysql = require('mysql');

var playerDao = require('../../../dao/playerDao');
var playerParamDao = require('../../../dao/playerParamDao');
var playerCardDao = require('../../../dao/playerCardDao');
var playerUnitDao = require('../../../dao/playerUnitDao');
var worldPlayerDao = require('../../../dao/worldPlayerDao');
var playerMissionLog = require('../../../dao/playerMissionLog');

var seqPlayer = require('../../../dao/seqPlayer');
var seqPlayerCard = require('../../../dao/seqPlayerCard');

var worldPlayerTrans = require('../../../trans/WorldPlayerTrans');
var PlayerTrans = require('../../../trans/PlayerTrans');

var CODE = require('../../../../../shared/code');
var commonUtils = require('../../../../../shared/util/commonUtils');
var utils = require('../../../util/utils');
var async = require('async');

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

  var playerId;
  var playerCardId;
	var self = this;

  var lead = 10; // TODO, to update it as param 
  // verify name
  if (!commonUtils.chkNickName(name)) {
    next(new Error('invalid name'), {code:CODE.PLAYER.ERR_WRONG_NAME});
    return;
  }

  var dbhandle_m = commonUtils.worldDBW(worldId);
  // get master DB handle of worldID
  //var mysqlc = this.app.get(dbhandle_m);
  //var mysqlc_master = this.app.get('game_master_m');

// test for transaction
// there are also xxx.end() called in xxxTrans.js

var mysqlc = mysql.createConnection(
  {
    host      : '127.0.0.1',
    user      : 'onemore',
    password  : 'onemore01',
    database  : 'game_world_1001',
    insecureAuth: true
  }                      
);

var mysqlc_master = mysql.createConnection(
  {
    host      : '127.0.0.1',
    user      : 'onemore',
    password  : 'onemore01',
    database  : 'game_master',
    insecureAuth: true
  }                      
);

mysqlc.connect();
mysqlc_master.connect();

  console.log(name);
  // check name exists or not
	playerDao.getPlayerByName(mysqlc, name, function(err, player) {
    if (err) {
			next(null, {code: CODE.FAIL, error:err});
			return;
    }
		if (!!player) {
			next(null, {code: CODE.PLAYER.ERR_NAME_EXIST});
			return;
		}
    console.log('before async: ' + name);

    async.auto({
      // generate a new playerId 
      newPlayerId: function(callback) {
        seqPlayer.getSequenceID(mysqlc_master, function(err, id) {
          if (err) {
          	logger.error('[register] fail to get playerId for ' + err.stack);
        	  next(null, {code: CODE.FAIL, error:err});
        		return;
          }
          else {
            playerId = id;
            console.log(id + ' is generated as newPlayerId');
            callback(null, id);
          }
        });
      },
      worldPlayer: ['newPlayerId', function(callback) {
        worldPlayerTrans.createWorldPlayer(mysqlc_master, uid, worldId, playerId, callback);
      }],
      // generate a new playerCardId 
      newPlayerCardId: function(callback) {
        seqPlayerCard.getSequenceID(mysqlc_master, function(err, id1) {
          if (err) {
          	logger.error('[register] fail to get playerCardId for ' + err.stack);
        	  next(null, {code: CODE.FAIL, error:err});
        		return;
          }
          else {
            playerCardId = id1;
            console.log(id1 + ' is generated as newPlayerCardId');
            callback(null, id1);
          }
        });
      },
      initPlayer: ['newPlayerId', 'worldPlayer', 'newPlayerCardId', function(callback) {
        var params = {
          serialId: playerCardId,
          cardId:   cardId,
          playerId: playerId,
          name:     name,
          sexType:  sexType,
          lead:     lead
        };
        PlayerTrans.initPlayer(mysqlc, params, function(err, res) {
          if (err) {
          	logger.error('[register] fail to get playerCardId for ' + err.stack);
        	  next(null, {code: CODE.FAIL, error:err});
        		return;
          }
          else {
            callback(null, res);
          }
        });
      }]
    }, function(err, results) {
      console.log('-----160------');
      if (err) {
        logger.error('error with player creation: ');
        console.log(err);
        next(null, {code: CODE.FAIL, error:err}); 
        return;
      }
      else {
        // here show generate player object
        next(null, {code: 200, player:results});
        return;
      }
    });
	});
};

/**
 * Check nickname for new register
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Boolean} true if ok
 */
pro.chkNickName = function(msg, session, next) {
  console.log(msg);
	//var uid = session.uid; // TODO uncomment this
  var uid = msg.uid; // just for browser develop style
  //var worldId = session.worldId;
  var worldId = msg.worldId;
  var name = msg.name;
	var self = this;

  // check NGWord. true for is ng 
  if (commonUtils.isNGWord(name)) {
    next(null, {code:CODE.PLAYER.ERR_NG_NAME});
    return;
  }

  // verify name, true for ok
  if (!commonUtils.chkNickName(name)) {
    next(null, {code:CODE.PLAYER.ERR_WRONG_NAME});
    return;
  }

  var playerId;
  var dbhandle_s = commonUtils.worldDBR(worldId);
  // get slave DB handle of worldID
  var mysqlc = this.app.get(dbhandle_s);

  console.log(name);
  // check name exists or not
	playerDao.getPlayerByName(mysqlc, name, function(err, player) {
    if (err) {
			next(null, {code: CODE.FAIL, error:err});
			return;
    }
		if (!!player) {
			next(null, {code: CODE.PLAYER.ERR_NAME_EXIST});
			return;
    }
    next(null, {code: CODE.OK});
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
