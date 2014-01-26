/*
 * pomelo api for unit
 * 2013-2014
 * @iamcactus
 */
var async = require('async');
var logger = require('pomelo-logger').getLogger(__filename);
var _ = require('underscore');

var utils       = require('../../../util/utils');
var commonUtils = require('../../../../../shared/util/commonUtils');
var CODE        = require('../../../../../shared/code');
var gameInit    = require('../../../../../shared/gameInit');

var dataApi = require('../../../util/dataApi');
var formula = require('../../../util/formula');

var playerCardDao     = require('../../../dao/playerCardDao');
var playerEquipDao    = require('../../../dao/playerEquipDao');
var playerUnitAllData = require('../../../dao/union/playerUnitAllData');
var EquipOnarmTrans   = require('../../../trans/EquipOnarmTrans');
var SkillOnarmTrans   = require('../../../trans/SkillOnarmTrans');
var CardOnUnitTrans   = require('../../../trans/CardOnUnitTrans');

var PlayerUnit  = require('../../../domain/PlayerUnit');
//var Mission     = require('../../../domain/Mission');

/*
 * verify the equip type and the position type
 * @param {Number} position where to arm the equip: weapon|defender|shoe|jewelry
 * @param {Number} equip_id in equip_data
 * @returns {Boolean}
 */ 
var _verifyPosition = function (position, equipId) {
  var equipData = dataApi.equip.findBy('equip_id', equipId);
  var equipConf = gameInit.EQUIP_CONF[equipData.type];

  if (position === equipConf.POSITION) {
    return true;
  }
  else {
    return false;
  }
}

/**
 * make report for KN _D_bag
 */
var _makeReport4UNIT = function(data) {
  var o = {};

  var Unit = new PlayerUnit(data);
  var unit = Unit.unit();
  var u = {}; // temp obj
  for (var i in unit) {
    var obj = unit[i];

    var id = obj.playerCardId;
    var p = {}; // temp obj
    p.id      = obj.playerCardId;
    p.cardId  = obj.cardId;

    var t = obj.cardObj;
    p.exp     = t.exp;
    p.lv      = t.level;
    p.stage   = t.evolved_cnt;

    var cardData   = dataApi.card.findBy('card_id', p.cardId);
    p.star    = cardData.star;
    p.role    = cardData.role;

    var conditionObj = dataApi.natureCondition.findBy('card_id', p.cardId);
    p.natural = conditionObj.natures;
    p.skill_k = cardData.skill_k;
    p.cur_exp = formula.currentExp(p.exp, p.lv);
    p.lvup_exp= formula.lvupExp(p.exp, p.lv);
    p.rest_exp= 0; // temp, what is this??
    p.atk_i   = cardData.atk_c;
    p.def_i   = cardData.def_c;
    p.hp_i    = cardData.hp_c;
    p.agi_i   = cardData.agi_c;
    p.skill_lv= formula.skillLevel(p.lv);
    p.type    = cardData.type;
    p.atk_xd  = 0;
    p.def_xd  = 0;
    p.hp_xd   = 0;
    p.agi_xd  = 0;
    p.atk_xdlv= 0;
    p.def_xdlv= 0;
    p.hp_xdlv = 0;
    p.agi_xdlv= 0;

    var origForce = formula.origForce(p.cardId, p.lv);
    p.hp      = origForce.hp_o;
    p.atk     = origForce.atk_o;
    p.def     = origForce.def_o;
    p.agi     = origForce.agi_o;
    p.active_natural = [];
   
    u[id] = p;
  }

  o["_D_bag"] = {};
  o["_D_bag"]["general"] = u;

  return o;
};

/**
 * make report for KN of equip onarm
 */
var _makeReport4ONARM = function(data) {
  var o = {};
  o = _makeReport4UNIT(data);

  var Unit = new PlayerUnit(data);
  // "_G_general_dress"
  o["_G_general_dress"] = Unit.toJSON4DRESS();

  return o;
};

/**
 * make report for KN of card onUnit
 */
var _makeReport4ONUNIT = function(data) {
  var o = {};

  var Unit = new PlayerUnit(data);
  o = _makeReport4ONARM(data);

  // "_G_formation"
  o["_G_formation"] = Unit.toJSON4FORMATION();
  // "_G_formation_max"
  o["_G_formation_max"] = gameInit.UNIT_INIT.COUNT; // ??? what is this

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
 * get unit info for KN format
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
pro.unitInfo = function(msg, session, next) {
  console.log('enter connector.unitInfo');
  console.log(msg);
  var playerId = msg.playerId;
  // temp, should be got from session
  var worldId = commonUtils.normalizeWorldId(msg.worldId);
  // temp, should be got from session

  // db handle
  var dbhandle_s = commonUtils.worldDBR(worldId);
  var mysqlc = this.app.get(dbhandle_s);

	async.auto({
    unitAllData: function(callback) {
      playerUnitAllData.get(mysqlc, playerId, callback);
    }
  }, function(err, res) {
		if (!!err || !res) {
      var code = CODE.FAIL;
      if (err.code) {
        code = err.code;
      }
      next(null, {code: code});
			return;
		}
    else {
      console.log('before makeReport');
      var report = _makeReport4UNIT(res.unitAllData);
		  next(null, {code: CODE.OK, result: report});
      return;
    }
	});
};

/**
 * set equip or skill into unit 
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
pro.onArm = function(msg, session, next) {
  console.log('enter connector.onArm');
  console.log(msg);

  var resValidation = commonUtils.validate('onarm', msg);
	if(!resValidation) {
    console.log('onarm resValidation fail');
		next(null, {code: CODE.ERR_WRONG_PARAM});
		return;
	}

  var playerId = msg.playerId;
  // temp, should be got from session
  var worldId = commonUtils.normalizeWorldId(msg.worldId);
  // temp, should be got from session
  var id = Number(msg.id); // id in player_equip;
  var positionId = Number(msg.positionId); // which unit to arm 
  var armPosition = Number(msg.armPosition); // where to arm
  var isArmEquip = 0;
  var isArmSkill = 0;

  // skill in [1..2], equip is in [3..6]
  // set flag
  if (armPosition > 0 && armPosition < 3) {
    isArmSkill = 1;
  }
  else if (armPosition < 7) {
    isArmEquip = 1;
  }
  else {
		next(null, {code: CODE.ERR_WRONG_PARAM});
		return;
  }

  // db handle
  var dbhandle_m  = commonUtils.worldDBW(worldId);
  var mysqlPool   = this.app.get(dbhandle_m);
  var dbhandle_s  = commonUtils.worldDBR(worldId);
  var mysqlPool_s = this.app.get(dbhandle_s);

	async.auto({
    getMaterial: function(callback) {
      if (isArmEquip) {
        playerEquipDao.getByEquipId(mysqlPool_s , playerId, id, function(err, res) {
          if (!!res && res.length > 0) {
            callback(null, res);
          }
          else {
            callback(err, null);
          }
        });
      }
      else if (isArmSkill) {
        playerSkillDao.getById(mysqlPool_s , playerId, id, function(err, res) {
          if (!!res && res.length > 0) {
            callback(null, res);
          }
          else {
            callback(err, null);
          }
        });
      }
    },
    onArm: ['getMaterial', function(callback, result) {
      if (!!result.getMaterial) {
        if (isArmEquip) {
          var t = result.getMaterial;
          if (!!_verifyPosition(armPosition, t[0].equip_id)) {
            mysqlPool.acquire(function(err, client) {
              EquipOnarmTrans.exec(client, playerId, positionId, armPosition, id, function(err, res) {
                if (!!err || !!res) {
                  mysqlPool.release(client);
                }
                callback(err, res);
              });
            });
          }
          else {
            callback({code: CODE.UNIT.ERR_MATERIAL}, null);
          }
        } // end of if (isArmEquip)
        else if (isArmSkill) {
          mysqlPool.acquire(function(err, client) {
            SkillOnarmTrans.exec(client, playerId, positionId, armPosition, id, function(err, res) {
              if (!!err || !!res) {
                mysqlPool.release(client);
              }
              callback(err, res);
            });
          });
        } // end of else
      } // end of if (!!result.getMaterial)
      else {
        callback({code: CODE.ERR_NO_MATERIAL}, null);
      }
    }],
    unitAllData: ['getMaterial', 'onArm', function(callback, result) {
      if (!!result.getMaterial && !!result.onArm) {
        playerUnitAllData.get(mysqlPool_s, playerId, callback);
      }
      else {
        callback(null, null);
      }
    }]
  }, function(err, res) {
		if (!!err || !res) {
      var code = CODE.FAIL;
      if (err.code) {
        code = err.code;
      }
      next(null, {code: code});
			return;
		}
    else {
      var report = _makeReport4ONARM(res.unitAllData);
		  next(null, {code: CODE.OK, result: report});
      return;
    }
	});
};

/**
 * set card into unit 
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
pro.onUnit = function(msg, session, next) {
  console.log('enter connector.onUnit');
  console.log(msg);

  var resValidation = commonUtils.validate('onunit', msg);
	if(!resValidation) {
    console.log('onunit resValidation fail');
		next(null, {code: CODE.ERR_WRONG_PARAM});
		return;
	}

  var playerId = msg.playerId;
  // temp, should be got from session
  var worldId = commonUtils.normalizeWorldId(msg.worldId);
  // temp, should be got from session
  var id = Number(msg.id); // id in player_card;
  var positionId = Number(msg.positionId); // set card into the position
  
  // verify
  if (positionId > 8 || positionId < 0) {
		next(null, {code: CODE.ERR_WRONG_PARAM});
		return;
  }

  // db handle
  var dbhandle_m  = commonUtils.worldDBW(worldId);
  var mysqlPool   = this.app.get(dbhandle_m);
  var dbhandle_s  = commonUtils.worldDBR(worldId);
  var mysqlPool_s = this.app.get(dbhandle_s);

	async.auto({
    getMaterial: function(callback) {
      playerCardDao.getById(mysqlPool_s , playerId, id, function(err, res) {
        if (!!res && res.length > 0) {
          callback(null, res);
        }
        else {
          callback(err, null);
        }
      });
    },
    onUnit: ['getMaterial', function(callback, result) {
      if (!!result.getMaterial) {
        var t = result.getMaterial;
        mysqlPool.acquire(function(err, client) {
          CardOnUnitTrans.exec(client, playerId, positionId, id, function(err, res) {
            if (!!err || !!res) {
              mysqlPool.release(client);
            }
            callback(err, res);
          });
        });
      } // end of if (!!result.getMaterial)
      else {
        callback({code: CODE.ERR_NO_MATERIAL}, null);
      }
    }],
    unitAllData: ['getMaterial', 'onUnit', function(callback, result) {
      if (!!result.getMaterial && !!result.onUnit) {
        playerUnitAllData.get(mysqlPool_s, playerId, callback);
      }
      else {
        callback(null, null);
      }
    }]
  }, function(err, res) {
		if (!!err || !res) {
      var code = CODE.FAIL;
      if (err.code) {
        code = err.code;
      }
      next(null, {code: code});
			return;
		}
    else {
      var report = _makeReport4ONUNIT(res.unitAllData);
		  next(null, {code: CODE.OK, result: report});
      return;
    }
	});
};

