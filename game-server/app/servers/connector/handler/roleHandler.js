/*
 * create player
 * 
 * 2013-2014
 * @iamcactus
 */


//var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger(__filename);
var mysql = require('mysql');
var async = require('async');

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

var CODE        = require('../../../../../shared/code');
var gameInit    = require('../../../../../shared/gameInit');
var commonUtils = require('../../../../../shared/util/commonUtils');
var utils       = require('../../../util/utils');
var dataApi     = require('../../../util/dataApi');

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
  var resValidation = commonUtils.validate('createPlayer', msg);
	if(!resValidation) {
    console.log('createPlayer resValidation fail');
		next(null, {code: CODE.ERR_WRONG_PARAM});
		return;
	}
  console.log('enter createPlayer');

	//var uid = session.uid; // TODO uncomment this
  var uid = msg.uid; // just for browser develop style
  //var worldId = session.worldId;
  var worldId = msg.worldId;

  var name    = msg.name;
  var sexType = msg.sexType;
  var cardId  = msg.cardId;
  var playerId;

	var self = this;

  var cardObj = dataApi.card.findBy('card_id', cardId);
  if (!cardObj) {
    next(null, {code:CODE.PLAYER.ERR_NG_CARD});
    return;
  }
  var lead = gameInit.LEAD_CONF[cardObj.star];

  // verify name
  if (!commonUtils.chkNickName(name)) {
    next(null, {code:CODE.PLAYER.ERR_WRONG_NAME});
    return;
  }

  // dbhandle
  var dbhandle_m = commonUtils.worldDBW(worldId);
  var mysqlPool = this.app.get(dbhandle_m);
  var dbhandle_s = commonUtils.worldDBR(worldId);
  var mysqlPool_s = this.app.get(dbhandle_s);

  var dbhandle_master = commonUtils.masterDBW();
  var mysqlc_master_1 = this.app.get(dbhandle_master);
  var mysqlc_master_2 = this.app.get(dbhandle_master);

  // check name exists or not
	playerDao.getPlayerByName(mysqlPool_s, name, function(err, player) {
    if (err) {
			next(null, {code: CODE.FAIL, error:err});
			return;
    }
		if (!!player) {
			next(null, {code: CODE.PLAYER.ERR_NAME_EXIST});
			return;
		}

    async.auto({
      // generate a new playerId 
      newPlayerId: function(callback) {
        seqPlayer.getSequenceID(mysqlc_master_1, function(err, id) {
          if (err) {
          	logger.error('[register] fail to get playerId for ');
            logger.error(err);
            callback(err, null);
          }
          else {
            console.log(id + ' is generated as newPlayerId');
            playerId = id;
            callback(null, id);
          }
        });
      },
      worldPlayer: ['newPlayerId', function(callback, result) {
        if (!!result.newPlayerId) {
          mysqlc_master_2.acquire(function(err, client) {
            worldPlayerTrans.createWorldPlayer(client, uid, worldId, playerId, function(err, res) {
              mysqlc_master_2.release(client);
              callback(err, res);
            });
          }); // end of mysqlPool.acquire
        }
        else {
        	callback({code: CODE.FAIL}, null);
        }
      }],
      // generate a new playerCardId 
      newPlayerCardId: function(callback) {
        seqPlayerCard.getSequenceID(mysqlc_master_1, function(err, id1) {
          if (err) {
          	logger.error('[register] fail to get playerCardId for ');
            logger.error(err);
            callback(err, null);
          }
          else {
            console.log(id1 + ' is generated as newPlayerCardId');
            callback(null, id1);
          }
        });
      },
      initPlayer: ['newPlayerId', 'worldPlayer', 'newPlayerCardId', function(callback, res) {
        if (!!res.newPlayerId && !!res.worldPlayer && !!res.newPlayerCardId) {
          var params = {
            serialId: res.newPlayerCardId,
            cardId:   cardId,
            playerId: res.newPlayerId,
            name:     name,
            sexType:  sexType,
            lead:     lead
          };

          mysqlPool.acquire(function(err, client) {
            PlayerTrans.initPlayer(client, params, function(err, res) {
              mysqlPool.release(client);
              callback(err, res);
            });
          }); // end of mysqlPool.acquire
        }
        else {
          callback({code: CODE.FAIL}, null);
        }
      }]
    }, function(err, results) {
      if (err || !results.initPlayer) {
        logger.error('error with player creation: ');
        console.log(err);
        next(null, {code: CODE.FAIL}); 
        return;
      }
      else {
        // here show generate player object
        if (!!playerId) {
          next(null, {code: 200, playerId: playerId});
          return;
        }
        else {
          logger.error('error with playerId');
          next(null, {code: 200});
          return;
        }
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

/*
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
*/
