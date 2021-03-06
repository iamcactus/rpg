/*
 * compose or decompose for card, equip, pet
 * 
 * return 
 * 2013-2014
 * @iamcactus
 */

/**
 * Module dependencies
 */
var logger = require('pomelo-logger').getLogger(__filename);
var async = require('async');
var _ = require('underscore');

var dataApi = require('../../../util/dataApi');
var utils = require('../../../util/utils');
var formula = require('../../../util/formula');
var drawPrize = require('../../../util/drawPrize');

//var Bag = require('../../domain/bag'); // TODO: prepare bag object 
var bagAllData = require('../../../dao/union/bagAllData');

var seqPlayerCard = require('../../../dao/seqPlayerCard');
var seqPlayerEquip = require('../../../dao/seqPlayerEquip');
var seqPlayerPet = require('../../../dao/seqPlayerPet');


var playerCardDao     = require('../../../dao/playerCardDao');
var playerEquipDao    = require('../../../dao/playerEquipDao');
var playerPetDao      = require('../../../dao/playerPetDao');
var playerFractionDao = require('../../../dao/playerFractionDao');
var BagSellTrans = require('../../../trans/BagSellTrans');

// transaction modules
var CardDecompoTrans  = require('../../../trans/CardDecompoTrans');
var EquipDecompoTrans = require('../../../trans/EquipDecompoTrans');
var PetDecompoTrans   = require('../../../trans/PetDecompoTrans');
var CardCompoTrans    = require('../../../trans/CardCompoTrans');
var EquipCompoTrans   = require('../../../trans/EquipCompoTrans');
var PetCompoTrans     = require('../../../trans/PetCompoTrans');

var gameInit = require('../../../../../shared/gameInit');
var CODE = require('../../../../../shared/code');
var commonUtils = require('../../../../../shared/util/commonUtils');

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
 * Get bag datas including cards, equips, pets, skills, pets
 * Handle the request from client, and response result to client
 *
 * @param {Object} msg
 * @param {Object} session
 * @param {Function} next
 * @returns {Object} bag datas
 * @api public
 */
pro.getFraction = function(msg, session, next) {
  var resValidation = commonUtils.validate('getFraction', msg);
	if(!resValidation) {
    console.log('getFraction resValidation fail');
		next(null, {code: CODE.ERR_WRONG_PARAM});
		return;
	}
  console.log('enter getFraction');

  // playerId should be checked with session
	var playerId = msg.playerId; // just for debug, playerId should be got from session
  var worldId = 1001; // just for debug, worldId shoule be got from session
  var bagType = msg.bagType; // use local variabal has better performance

  var typeId = commonUtils.getInitID(gameInit.BAG, bagType);
  if (!typeId) {
	  next(null, {code: CODE.FAIL});
    return;
  }

  //var memcached = this.app.get('memcached');
  //var missionLog = {};

  var dbhandle_s = commonUtils.worldDBR(worldId);
  var mysqlc = this.app.get(dbhandle_s);

  playerFractionDao.getByType(mysqlc, playerId, typeId, function(err, res) {
    if (err) {
      logger.error('error with bagAllData.getByType: '  + ' err: ' + err);
    	next(null, {code: CODE.FAIL});
    }
    else {
      if (!!res) { // gets
        next(null, 
          { code: 200, 
              result:{
                "_G_chip":res
              }
          });
      }
      else {
        next(null, {code: 200});
      }
    }
  });
};

var verifyMaterial = function(mArray, typeId, star) {
  var aLength = mArray.length;

console.log(mArray);
  if (typeId === gameInit.BAG.CARD.id) {
    if (aLength !== gameInit.DECOMPO.CARD_NUM) {
      return false;
    }
    for (var i=0; i<aLength; i++) {
      var confData = dataApi.card.findBy('card_id', mArray[i].card_id);
      if (confData.star != star) {
        console.log('card star is wrong');
        return false;
      }
    }
  }
  else if (typeId === gameInit.BAG.EQUIP.id) {
    if (aLength !== gameInit.DECOMPO.EQUIP_NUM) {
      return false;
    }
    for (var i=0; i<aLength; i++) {
      var confData = dataApi.equip.findBy('equip_id', mArray[i].equip_id);
      if (confData.star !== star) {
        console.log('equip star is wrong');
        return false;
      }
    }
  }
  else if (typeId === gameInit.BAG.PET.id) {
    if (aLength !== gameInit.DECOMPO.PET_NUM) {
      return false;
    }
    for (var i=0; i<aLength; i++) {
      var confData = dataApi.pet.findBy('pet_id', mArray[i].pet_id);
      if (confData.star !== star) {
        console.log('pet star is wrong');
        return false;
      }
    }
  }

  return true;
};

/*
 * @param {Number} typeId typeId for card, equip or pet
 * @param {Object} fraction fraction obj
 * @param {Object} ids array of id for card, equip or pet
 */
var _makeReport4DEC = function(typeId, fraction, ids) {
  var o = {};

  var typeF = ''; // type for fraction
  var typeM = ''; // type for material
  if (typeId === gameInit.BAG.CARD.id) {
    typeM = gameInit.BAG.CARD.type;
    typeF = "_G_soul";
  }
  else if (typeId === gameInit.BAG.EQUIP.id) {
    typeM = gameInit.BAG.EQUIP.type;
    typeF = "_G_chip";
  }
  else if (typeId === gameInit.BAG.PET.id) {
    typeM = gameInit.BAG.PET.type;
    typeF = "_G_petsoul";
  }

  o[typeF] = fraction;
  
  var m = {};
  for (var i=0; i<ids.length; i++) {
    var k = ids[i];
    m[k] = {
      id: k,
      num:0
    };
  }
  o["_U_bag"] = {};
  o["_U_bag"][typeM] = m; // apk will update _G_xxx by this key-value
  return o;
};

// please remove following into /domain/Card
// cardU is from player_card
var cardU = function(id, cardData) {
  var c = {};
  var o = {};
  o.id        = id;
  o.cardId    = cardData.card_id;
  o.price     = cardData.price;
  o.lv        = 1; // fxck
  o.exp       = 0; // fxck
  o.type      = gameInit.BAG.CARD.type;
  o.sell_silver = cardData.price;
  o.stage     = 0; // TODO: stage is evolution count??
  c[o.id] = o;

  return c;
};

// please remove following into /domain/Card

// cardD is from card_data
var cardD = function(id, cardData) {
  var c = {};
  var o = {};

  var conditionObj = dataApi.natureCondition.findBy('card_id', cardData.card_id);

  o.id        = id;
  o.cardId    = cardData.card_id;
  o.price     = cardData.price;
  o.lv        = 1; // fxck
  o.exp       = 0; // fxck
  o.star      = cardData.sta;
  o.role      = cardData.role;
  o.natural   = conditionObj.natures;
  o.skill_k   = cardData.skill_k;
  o.cur_exp   = 0;
  o.lvup_exp  = formula.lvupExp(o.cur_exp, o.lv);
  o.rest_exp  = 0;
  o.atk_i     = cardData.atk_c;
  o.def_i     = cardData.def_c;
  o.agi_i     = cardData.agi_c;
  o.hp_i      = cardData.hp_c;

  o.atk       = cardData.atk_c;
  o.def       = cardData.def_c;
  o.agi       = cardData.agi_c;
  o.hp        = cardData.hp_c;

  o.skill_lv  = 1;

  o.type      = gameInit.BAG.CARD.type;
  o.stage     = 0; // TODO: stage is evolution count??

  o.atk_xd    = 0;
  o.def_xd    = 0;
  o.agi_xd    = 0;
  o.hp_xd     = 0;

  o.atk_xdlv  = 0;
  o.def_xdlv  = 0;
  o.agi_xdlv  = 0;
  o.hp_xdlv   = 0;

  o.active_natural = [];

  c[o.id] = o;

  return c;
};

// please remove following into /domain/Equip

// equipU is from player_equip
var equipU = function(id, equipData) {
  var e = {};
  var o = {}; // current equip object
  var equipObj = dataApi.equip.findBy('equip_id', equipData.equip_id);
  var equipConf = gameInit.EQUIP_CONF[equipData.type];

  o.id      = id;
  o.equipId = equipData.equip_id;
  o.lv      = 1; // fxck
  o.type    = equipConf.TYPE;
  o.group   = equipData.group_id;
  o.initial = equipData.initial;
  o.price   = formula.equipPrice(o.lv, equipData.equip_id);
  o.star    = equipData.star;
  o.figure  = formula.equipOrigForce(equipData.equip_id, o.lv);
  o.effect  = equipConf.EFFECT;
  o.clv     = 0; // what is this ???
  o.cltimes = 0; // what is this ???
  o.gexp    = 0; // what is this ???
  o.gfigure = 0; // what is this ???

  e[o.id] = o;

  return e;
};

// please remove following into /domain/Equip
// equipD is from equip_data
var equipD = function(id, equipData) {
  return equipU(id, equipData);
};

/*
 * @param {Number} typeId typeId for card, equip or pet
 * @param {Number} id id for card, equip or pet in player_xxx
 * @param {Object} fraction fraction obj
 * @param {Object} prizeData  obj for card, equip or pet
 */
var _makeReport4COM = function(typeId, fraction, id, prizeData) {
  var o = {}; // temp obj for return

  var typeF = ''; // type for fraction
  var typeM = ''; // type for material

  var p = {}; // temp obj for U_bag
  var q = {}; // temp obj for D_bag

  if (typeId === gameInit.BAG.CARD.id) {
    typeM = gameInit.BAG.CARD.type;
    typeF = "_G_soul";
    p = cardU(id, prizeData);
    q = cardD(id, prizeData);
  }
  else if (typeId === gameInit.BAG.EQUIP.id) {
    typeM = gameInit.BAG.EQUIP.type;
    typeF = "_G_chip";
    p = equipU(id, prizeData);
    q = equipD(id, prizeData);
  }
  else if (typeId === gameInit.BAG.PET.id) {
    typeM = gameInit.BAG.PET.type;
    typeF = "_G_petsoul";
    //p = petU(id, prizeData);
    //q = petD(id, prizeData);
  }

  o[typeF] = fraction; 

  o["_U_bag"] = {};
  o["_U_bag"][typeM] = p; // apk will update _G_xxx by this key-value

  o["_D_bag"] = {};
  o["_D_bag"][typeM] = q; // apk will update _G_xxx by this key-value

  return o;
};

/**
 * Decompose hero or equipment or pet into fraction.
 * Handle the request from client, and response result to client
 *
 * @param {Object} msg
 * @param {Object} session
 * @param {Function} next
 * @returns {Boolean} true of false 
 * @api public
 */
pro.decompo = function(msg, session, next) {
  var resValidation = commonUtils.validate('decompo', msg);
	if(!resValidation) {
    console.log('decompo resValidation fail');
		next(null, {code: CODE.ERR_WRONG_PARAM});
		return;
	}
  console.log('enter decompo');

  // playerId should be checked with session
	var playerId = msg.playerId; // just for debug, playerId should be got from session
  var worldId = 1001; // just for debug, worldId shoule be got from session
  var bagType = msg.bagType; // use local variabal has better performance
  var materialData = msg.data;
  var star    = Number(msg.star);

  var fractionNum = 1; // fraction number

  var typeId = commonUtils.getInitID(gameInit.BAG, bagType);
  if (!typeId) {
	  next(null, {code: CODE.FAIL});
    return;
  }

  var ids = [];
  for (var i=0; i< materialData.length; i++) {
    ids.push(Number(materialData[i].id));
  }
  if (!ids || ids.length === 0) {
    console.log('decompo has not enough items');
		next(null, {code: CODE.FACTORY.ERR_MATERIAL_NUM});
		return;
  }
  _.uniq(ids); // for cheat in case of duplicated items, ex: [2019, 2019, 2020] 
  //var memcached = this.app.get('memcached');
  //var missionLog = {};

  var dbhandle_m = commonUtils.worldDBW(worldId);
  var mysqlPool = this.app.get(dbhandle_m);

  var dbhandle_s = commonUtils.worldDBR(worldId);
  var mysqlPool_s = this.app.get(dbhandle_s);

  // TODO: refactoring
  async.auto({
    hasMaterial: function(callback) {
      if (typeId === gameInit.BAG.CARD.id) {
        playerCardDao.getMulti(mysqlPool_s, playerId, ids, function(err, res) {
          if (!!res && res.length === ids.length) {
            if (verifyMaterial(res, typeId, star)) {
              callback(null, true);
            }
            else {
              console.log('decompo has not enough cards');
              callback({code: CODE.FACTORY.ERR_MATERIAL_STAR}, null);
            }
          }
          else if (!!err) {
            callback(err, null);
          }
          else {
            callback({code: CODE.FACTORY.ERR_MATERIAL_NUM}, null);
          }
        });
      }
      else if (typeId === gameInit.BAG.EQUIP.id) { 
        playerEquipDao.getMulti(mysqlPool_s, ids, function(err, res) {
          if (!!res && res.length === ids.length) {
            if (verifyMaterial(res, typeId, star)) {
              callback(null, true);
            }
            else {
              console.log('decompo has not enough equips');
              callback({code: CODE.FACTORY.ERR_MATERIAL_STAR}, null);
            }
          }
          else if (!!err) {
            callback(err, null);
          }
          else {
            callback({code: CODE.FACTORY.ERR_MATERIAL_NUM}, null);
          }
        });
      }
      else if (typeId === gameInit.BAG.PET.id) {
        playerPetDao.getMulti(mysqlPool_s, ids, function(err, res) {
          if (!!res && res.length === ids.length) {
            if (verifyMaterial(res, typeId, star)) {
              callback(null, true);
            }
            else {
              console.log('decompo has not enough pets');
              callback({code: CODE.FACTORY.ERR_MATERIAL_STAR}, null);
            }
          }
          else if (!!err) {
            callback(err, null);
          }
          else {
            callback({code: CODE.FACTORY.ERR_MATERIAL_NUM}, null);
          }
        });
      }
    },
    getFraction: function(callback) {
      playerFractionDao.getByTypeAndStar(mysqlPool_s, playerId, typeId, star, callback);
    },
    decompoTrans: ['hasMaterial', 'getFraction', function(callback, results) {
      if (!!results.hasMaterial) {
        // prepare fraction number for @returns
        if (!!results.getFraction) {
          var t = results.getFraction;
          if (t.length > 0) {
            fractionNum += t[0].num; // number after decompo
          }
        }
        // transaction: delete item and add fraction
        mysqlPool.acquire(function(err, client) {
          if (typeId === gameInit.BAG.CARD.id) {
            CardDecompoTrans.exec(client, materialData, playerId, star, fractionNum, function(err, res) {
              if (!!err || !!res) {
                mysqlPool.release(client);
              }
              callback(err, res);
            });
          }
          else if (typeId === gameInit.BAG.EQUIP.id) { 
            EquipDecompoTrans.exec(client, materialData, playerId, star, fractionNum, function(err, res) {
              if (!!err || !!res) {
                mysqlPool.release(client);
              }
              callback(err, res);
            });
          }
          else if (typeId === gameInit.BAG.PET.id) {
            PetDecompoTrans.exec(client, materialData, playerId, star, fractionNum, function(err, res) {
              if (!!err || !!res) {
                mysqlPool.release(client);
              }
              callback(err, res);
            });
          }
        }); // end of mysqlPool.acquire
      } // end of if (!!results.hasMaterial)
      else {
        callback({code: CODE.FACTORY.ERR_MATERIAL_NUM}, null);
      }
    }] // end of decompoTrans
  }, function(err, res) {
    if (err) {
      logger.error('pro.decompo: '  + ' err');
      logger.error(err);
      var code = CODE.FAIL;
      if (err.code) {
        code = err.code;
      }
      next(null, {code: code});
    }
    else {
      if (!!res && !!res.decompoTrans) {
        playerFractionDao.getByType(mysqlPool_s, playerId, typeId, function(err, res1) {
          if (!!err || !res1) {
            next(null, {code: 200}); // cant get fraction, should not be here
          }
          else {
            var report = _makeReport4DEC(typeId, res1, ids);
            next(null, { code: 200, result: report});
          }
        });
      }
      else {
        next(null, {code: CODE.FAIL});
      }
    }
  });
};

/**
 * Compose fraction into hero, equipment or pet
 * Handle the request from client, and response result to client
 *
 * @param {Object} msg
 * @param {Object} session
 * @param {Function} next
 * @returns {Object} data of composed item 
 * @api public
 */
pro.compo = function(msg, session, next) {
  var resValidation = commonUtils.validate('compo', msg);
	if(!resValidation) {
    console.log('compo resValidation fail');
		next(null, {code: CODE.ERR_WRONG_PARAM});
		return;
	}
  console.log('enter compo');

  // playerId should be checked with session
	var playerId = msg.playerId; // just for debug, playerId should be got from session
  var worldId = 1001; // just for debug, worldId shoule be got from session
  var bagType = msg.bagType; // use local variabal has better performance
  var fractionStar    = Number(msg.star); // the star of fraction
  var targetStar      = fractionStar + 1;

  var sid;  // sequence id for item from fraction 
  var prizeData; // conf data for composed item
  var prizeNum = 1; // by default, compose fractions into 1 item;

  var typeId = commonUtils.getInitID(gameInit.BAG, bagType);
  if (!typeId) {
	  next(null, {code: CODE.FAIL});
    return;
  }

  // prepare item composed
  var dataArray;
  if (typeId === gameInit.BAG.CARD.id) {
    //0: only for resorved
    dataArray = drawPrize.hero(0, targetStar, prizeNum);
  }
  else if (typeId === gameInit.BAG.EQUIP.id) {
    dataArray = drawPrize.equip(0, targetStar, prizeNum);
  }
  else if (typeId === gameInit.BAG.PET.id) {
    dataArray = drawPrize.pet(0, targetStar, prizeNum);
  }
  if (!!dataArray && dataArray.length > 0) {
    prizeData = dataArray[0]; // only 1 prize
  }

  if (!prizeData) {
	  next(null, {code: CODE.FAIL});
    return;
  }

  //var memcached = this.app.get('memcached');
  //var missionLog = {};

  // get db handle
  var dbhandle_m = commonUtils.worldDBW(worldId);
  var mysqlPool = this.app.get(dbhandle_m);
  var dbhandle_s = commonUtils.worldDBR(worldId);
  var mysqlPool_s = this.app.get(dbhandle_s);
  var dbhandle_master = commonUtils.masterDBW();
  var mysqlc_master = this.app.get(dbhandle_master);

  // TODO: refactoring
  async.auto({
    // sequenceId is used for id in player_card, player_equip or player_pet
    sequenceId:   function(callback) {
      if (typeId === gameInit.BAG.CARD.id) {
        seqPlayerCard.getSequenceID(mysqlc_master, function(err, sid) {
          if (err) {
            callback(err, null);
          }
          else {
            callback(null, sid);
          }
        });
      }
      else if (typeId === gameInit.BAG.EQUIP.id) { 
        seqPlayerEquip.getSequenceID(mysqlc_master, function(err, sid) {
          if (err) {
            callback(err, null);
          }
          else {
            callback(null, sid);
          }
        });
      }
      else if (typeId === gameInit.BAG.PET.id) { 
        seqPlayerPet.getSequenceID(mysqlc_master, function(err, sid) {
          if (err) {
            callback(err, null);
          }
          else {
            callback(null, sid);
          }
        });
      }
      else {
        callback(null, null);
      }
    }, // end of sequenceId
    compoTrans: ['sequenceId', function(callback, result) {
      if (!!result.sequenceId) {
        // transaction: delete fraction and add item
        mysqlPool.acquire(function(err, client) {
          if (typeId === gameInit.BAG.CARD.id) { // general (also means card)
            var fractionNum = gameInit.COMPO.CARD_NUM;
            CardCompoTrans.exec(client, playerId, fractionStar, result.sequenceId, fractionNum, prizeData.card_id, function(err, res) {
              if (!!err || !!res) {
                mysqlPool.release(client);
              }
              callback(err, res);
            });
          }
          else if (typeId === gameInit.BAG.EQUIP.id) { // equip
            var fractionNum = gameInit.COMPO.EQUIP_NUM;
            EquipCompoTrans.exec(client, playerId, fractionStar, result.sequenceId, fractionNum, prizeData.equip_id, function(err, res) {
              if (!!err || !!res) {
                mysqlPool.release(client);
              }
              callback(err, res);
            });
          }
          else if (typeId === gameInit.BAG.PET.id) { // pet
            var fractionNum = gameInit.COMPO.PET_NUM;
            PetCompoTrans.exec(client, playerId, fractionStar, result.sequenceId, fractionNum, prizeData.pet_id, function(err, res) {
              if (!!err || !!res) {
                mysqlPool.release(client);
              }
              callback(err, res);
            });
          }
        }); // end of mysqlPool.acquire
      }
      else {
        callback({code: CODE.FAIL}, null);
      }
    }] // end of compoTrans
  }, function(err, res) {
    if (err) {
      logger.error('pro.compo: '  + ' err');
      logger.error(err);
      var code = CODE.FAIL;
      if (err.code) {
        code = err.code;
      }
      next(null, {code: code});
    }
    else {
      if (!!res && !!res.compoTrans) {
        playerFractionDao.getByType(mysqlPool_s, playerId, typeId, function(err, res1) {
          if (!!err || !res1) {
            next(null, {code: 200}); // cant get fraction, should not be here
          }
          else {
            var report = _makeReport4COM(typeId, res1, res.sequenceId, prizeData);
            next(null, { code: 200, result: report});
          }
        });
      }
      else {
        next(null, {code: CODE.FAIL});
      }
    }
  });
};
