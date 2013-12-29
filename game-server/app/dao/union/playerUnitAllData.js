var logger = require('pomelo-logger').getLogger(__filename);
//var LEVELCONF = require('../../../shared/levelConf');
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
var playerUnitDao = require('../playerUnitDao');
var playerEquipDao = require('../playerEquipDao');
var playerPetDao = require('../playerPetDao');
var playerSkillDao = require('../playerSkillDao');
var unitMeridianDao = require('../unitMeridianDao');

var playerUnitAllData = module.exports;

var ids = [];
playerUnitAllData.get = function(mysqlc, playerId, cb) {
  async.auto({
    player: function(callback) {
      playerDao.getPlayerByPlayerId(mysqlc, playerId, function(err, res) {
        if (!!err || !res) {
          logger.error('Get playerData failed! ' + err);
        }
        callback(err, res);
      });
    },
    playerParam: function(callback) {
      playerParamDao.get(mysqlc, playerId, function(err, res) {
        if(!!err || !res) {
          logger.error('Get playerParam failed! ' + err);
        }
        callback(err, res);
      });
    },
    playerUnit: function(callback) {
      playerUnitDao.get(mysqlc, playerId, function(err, res) {
        if(!!err || !res) {
          logger.error('Get playerUnit failed! ' + err);
        }
        callback(err, res);
      });
    },
    playerCardIds: ['playerUnit', function(callback, res) {
      commonUtils.makeArray(res.playerUnit, 'position_id', 'player_card_id', function(err, res1) {
        if (!!err || !res1) {
          logger.error('Get playerCardIds failed! ' + err);
        }
        ids = res1;
        callback(err, res1);
      });
    }],
    playerCard: ['playerCardIds', function(callback, res) {
      //var ids = res.playerCardIds;
      console.log(ids);
      playerCardDao.getMulti(mysqlc, ids, function(err, res) {
        if(!!err || !res) {
          logger.error('Get playerCard failed! ' + err);
        }
        callback(err, res);
      });
    }],
    playerEquip: function(callback, res) {
      playerEquipDao.get(mysqlc, playerId, 1, function(err, res) { // 1 for onArm
        if(!!err || !res) {
          logger.error('Get playerEquip failed! ' + err);
        }
        callback(err, res);
      });
    },
    playerPet: function(callback, res) {
      playerPetDao.get(mysqlc, playerId, 1, function(err, res) { // 1 for onArm
        if(!!err || !res) {
          logger.error('Get playerPet failed! ' + err);
        }
        callback(err, res);
      });
    },
    playerSkill: function(callback, res) {
      playerSkillDao.get(mysqlc, playerId, 1, function(err, res) { // 1 for onArm
        if(!!err || !res) {
          logger.error('Get playerSkill failed! ' + err);
        }
        callback(err, res);
      });
    },
    playerMeridian: ['playerCardIds', function(callback) {
      unitMeridianDao.getMulti(mysqlc, ids, function(err, res) {
        if(!!err || !res) {
          logger.error('Get playerMeridian failed! ' + err);
        }
        callback(err, res);
      });
    }]
  }, function(err, results) {
    //console.log(results);
     if (err) {
        utils.invokeCallback(cb, err, null);
     }
     else {
        utils.invokeCallback(cb, null, results);
     }
  });
};
