var bagAllData = module.exports;

var logger = require('pomelo-logger').getLogger(__filename);
var assert = require('assert');
var async = require('async');
//var _ = require('underscore');
var commonUtils = require('../../../../shared/util/commonUtils');

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

var Bag = require('../../domain/bag');

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
      console.log(playerId);
      result["playerId"] = playerId;

      console.log(result);
      utils.invokeCallback(cb, null, new Bag(result));
    }
  });
};
