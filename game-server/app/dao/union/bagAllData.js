var bagAllData = module.exports;

var logger = require('pomelo-logger').getLogger(__filename);
var assert = require('assert');
var async = require('async');
//var _ = require('underscore');
var commonUtils = require('../../../../shared/util/commonUtils');
var gameInit = require('../../../../shared/gameInit');

var dataApi = require('../../util/dataApi');
var utils = require('../../util/utils');
var Player = require('../../domain/player');
var playerDao = require('../playerDao');
var playerParamDao = require('../playerParamDao');
var playerCardDao = require('../playerCardDao');
var playerEquipDao = require('../playerEquipDao');
var playerItemDao = require('../playerItemDao');
var playerPetDao = require('../playerPetDao');
var playerSkillDao = require('../playerSkillDao');
var playerUnitDao = require('../playerUnitDao');
var unitMeridianDao = require('../unitMeridianDao');

var Bag = require('../../domain/Bag');

bagAllData.get = function(mysqlc, playerId, cb) {
  async.auto({
    playerCard: function(callback, res) {
      // bag tag: hero
      playerCardDao.get(mysqlc, playerId, function(err, res) {
        if(!!err || !res) {
          logger.error('Get playerCard failed! ');
          logger.error(err);
        }
        callback(err, res);
      });
    },
    playerEquip: function(callback, res) {
      // bag tag: equip
      playerEquipDao.get(mysqlc, playerId, 0, function(err, res) { // 0 for all equips
        if(!!err || !res) {
          logger.error('Get playerEquip failed! ');
          logger.error(err);
        }
        callback(err, res);
      });
    },
    playerPet: function(callback, res) {
      // bag tag: pet
      playerPetDao.get(mysqlc, playerId, 0, function(err, res) { // 0 for all pets
        if(!!err || !res) {
          logger.error('Get playerPet failed! ');
          logger.error(err);
        }
        callback(err, res);
      });
    },
    playerSkill: function(callback, res) {
      // bag tag: skill
      playerSkillDao.get(mysqlc, playerId, 0, function(err, res) { // 0 for all skills
        if(!!err || !res) {
          logger.error('Get playerSkill failed! ');
          logger.error(err);
        }
        callback(err, res);
      });
    },
    playerItem: function(callback) {
      // bag tag: item
      playerItemDao.get(mysqlc, playerId, function(err, res) {
        if(!!err || !res) {
          logger.error('Get playerItem failed! ');
          logger.error(err);
        }
        callback(err, res);
      });
    }
  }, function(err, result) {
    //console.log(results);
    if (err) {
      utils.invokeCallback(cb, err, null);
    }
    else {
      result["playerId"] = playerId;
      utils.invokeCallback(cb, null, new Bag(result));
    }
  });
};

bagAllData.getByType = function(mysqlc, playerId, type, cb) {
  var typeId = commonUtils.getInitID(gameInit.BAG, type);

  if (typeId === gameInit.BAG.CARD.id) {
    playerCardDao.get(mysqlc, playerId, function(err, result) {
      if (!!err) {
        logger.error('Get playerCard failed! ');
        logger.error(err);
        utils.invokeCallback(cb, err, null);
      }
      else if (!!result && result.length > 0) {
        result["playerId"]    = playerId;
        result["bagType"]     = type;
        result["playerCard"]  = result;
        utils.invokeCallback(cb, null, new Bag(result));
      }
      else {
        utils.invokeCallback(cb, null, []);
      }
    });
  }
  else if (typeId === gameInit.BAG.EQUIP.id) {
    playerEquipDao.get(mysqlc, playerId, 0, function(err, result) { // 0 for all equips
      if(!!err) {
        logger.error('Get playerEquip failed! ');
        logger.error(err);
      }
      else if (!!result && result.length > 0) {
        result["playerId"] = playerId;
        result["bagType"]     = type;
        result["playerEquip"]  = result;
        utils.invokeCallback(cb, null, new Bag(result));
      }
      else {
        utils.invokeCallback(cb, null, []);
      }
    });
  }
  else if (typeId === gameInit.BAG.PET.id) {
    playerPetDao.get(mysqlc, playerId, 0, function(err, result) { // 0 for all pets
      if(!!err) {
        logger.error('Get playerPet failed! ');
        logger.error(err);
      }
      else if (!!result && result.length > 0) {
        result["playerId"] = playerId;
        result["bagType"]     = type;
        result["playerPet"]  = result;
        utils.invokeCallback(cb, null, new Bag(result));
      }
      else {
        utils.invokeCallback(cb, null, []);
      }
    });
  }
  else if (typeId === gameInit.BAG.SKILL.id) {
    playerSkillDao.get(mysqlc, playerId, 0, function(err, result) { // 0 for all skills
      if(!!err) {
        logger.error('Get playerPet failed! ');
        logger.error(err);
      }
      else if (!!result && result.length > 0) {
        result["playerId"] = playerId;
        result["bagType"]     = type;
        result["playerSkill"]  = result;
        utils.invokeCallback(cb, null, new Bag(result));
      }
      else {
        utils.invokeCallback(cb, null, []);
      }
    });
  }
  else if (typeId === gameInit.BAG.ITEM.id) {
    playerItemDao.get(mysqlc, playerId, function(err, result) {
      if(!!err) {
        logger.error('Get playerItem failed! ');
        logger.error(err);
      }
      else if (!!result && result.length > 0) {
        result["playerId"] = playerId;
        result["bagType"]     = type;
        result["playerItem"]  = result;
        utils.invokeCallback(cb, null, new Bag(result));
      }
      else {
        utils.invokeCallback(cb, null, []);
      }
    });
  }
  else {
    utils.invokeCallback(cb, null, null);
  }
};
