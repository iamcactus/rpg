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

/**
 * make report for KN
 */
var _makeReport = function(data) {
  var o = {};

  console.log('in makeReport');
  console.log(data);

  var PlayerData = new Player(data);

  // "_G_userinfo"
  o["_G_userinfo"] = PlayerData.toJSON4USERINFO();

  // "_G_vipinfo"
  o["_G_vipinfo"] = PlayerData.toJSON4VIPINFO();
  o["_G_viplv"]   = o["_G_vipinfo"].lv;

  // "_G_account"
  o["_G_account"] = PlayerData.toJSON4ACCOUNT();

  // "_G_power"
  o["_G_power"] = PlayerData.toJSON4POWER();

  var Unit = new PlayerUnit(data);

  // "_G_formation"
  o["_G_formation"] = Unit.toJSON4FORMATION();

  // "_G_formation_max"
  o["_G_formation_max"] = gameInit.UNIT_INIT.COUNT; // ??? what is this

  // "_G_formation_conf"
  o["_G_formation_conf"] = gameInit.UNIT_INIT.CONF;

  // "_G_general_dress"
  o["_G_general_dress"] = Unit.toJSON4DRESS();

  var PlayerBag = new Bag(data);
  // "_G_bag_equip"
  o["_G_bag_equip"] = PlayerBag.toJSON4EQUIP();

  // "_G_bag_skill"
  o["_G_bag_skill"] = PlayerBag.toJSON4SKILL();

  // "_G_bag_pet"
  o["_G_bag_pet"] = PlayerBag.toJSON4PET();

  // "_G_bag_general"
  o["_G_bag_genral"] = PlayerBag.toJSON4GENERAL();

  // "_G_bag_prop"
  o["_G_bag_prop"] = PlayerBag.toJSON4PROP();

  // "_G_pet_on"
  var playerPetIdOn = PlayerBag.toJSON4PETON();
  if (playerPetIdOn) {
    o["_G_pet_on"] = playerPetIdOn;
  }
  //o["_G_pet_attach_attr"] = PlayerBag.toJSON4PETATTACHATTR();

  // "_G_mission_cur"
  o["_G_mission_cur"] = PlayerData.toJSON4MISSIONCUR();

  return o;
};

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
 * @return {Void}
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
  var dbhandle_s = commonUtils.worldDBR(worldId);
  var mysqlc = this.app.get(dbhandle_s);
  var playerId;

	if(!token) {
		next(null, {code: CODE.ENTRY.FA_TOKEN_INVALID});
		return;
	}

  console.log(111);
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
		}, 
    function(res, cb) {
      console.log('After worldPlayerDao.getWorldPlayerByUidAndWorldId');
      console.log(res);

      // TODO if there is no further process,
      // following shoule be removed into callback function "function(err, result)"
      // return result there would be more reasonable

      var playerObj = res[0];
			if(!playerObj || playerObj.length === 0) {
        // no player data, app/apk should show player generation scene
        cb({code: CODE.NONE_PLAYER}, null);
			}
      else {
        playerId = playerObj.player_id;
        playerAllData.get(mysqlc, playerId, cb);
      }
    }
    /*
    , function(cb) {
			self.app.rpc.chat.chatRemote.add(session, player.userId, player.name,
				channelUtil.getGlobalChannelName(), cb);
		}
    */
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
      if (!!playerId) {
			  session.set('playerId', playerId);
      }
      session.set('worldId', worldId);
      //console.log(session);

      console.log('before makeReport');
      var report = _makeReport(result);
		  next(null, {code: CODE.OK, result: report});
      return;
    }
	});
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
