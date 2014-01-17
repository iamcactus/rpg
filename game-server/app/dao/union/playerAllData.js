/*
 * collection all data for player 
 * 
 * return 
 * 2013-2014
 * @iamcactus
 */
var logger  = require('pomelo-logger').getLogger(__filename);
var assert  = require('assert');
var async   = require('async');
var _       = require('underscore');

var commonUtils = require('../../../../shared/util/commonUtils');
var dataApi     = require('../../util/dataApi');
var utils       = require('../../util/utils');
var Player      = require('../../domain/player');

var playerDao       = require('../playerDao');
var playerParamDao  = require('../playerParamDao');
var playerCardDao   = require('../playerCardDao');
var playerEquipDao  = require('../playerEquipDao');
var playerItemDao   = require('../playerItemDao');
var playerUnitDao   = require('../playerUnitDao');
var playerPetDao    = require('../playerPetDao');
var playerSkillDao  = require('../playerSkillDao');
var unitMeridianDao = require('../unitMeridianDao');

var playerAllData = module.exports;

var ids = [];
playerAllData.get = function(mysqlc, playerId, cb) {
  async.auto({
    playerData: function(callback) {
      playerDao.getPlayerByPlayerId(mysqlc, playerId, function(err, res) {
        if (!!err) {
          logger.error('Get playerData failed! ' + err);
        }
        else {
          callback(err, res); // TODO: check res, shold not be null
        }
      });
    },
    playerParam: function(callback) {
      playerParamDao.get(mysqlc, playerId, function(err, res) {
        if (!!err) {
          logger.error('Get playerParam failed! ' + err);
        }
        else {
          callback(err, res); // TODO: check res, shold not be null
        }
      });
    },
    playerUnit: function(callback) {
      playerUnitDao.get(mysqlc, playerId, function(err, res) {
        if (!!err) {
          logger.error('Get playerUnit failed! ' + err);
        }
        else {
          callback(err, res); // TODO: check res, shold not be null
        }
      });
    },
    playerCard: function(callback, res) {
      playerCardDao.get(mysqlc, playerId, function(err, res) {
        if (!!err) {
          logger.error('Get playerCard failed! ' + err);
        }
        else {
          callback(err, res); // TODO: check res, shold not be null
        }
      });
    },
    playerEquip: function(callback, res) {
      playerEquipDao.get(mysqlc, playerId, 0, function(err, res) { // 0 for all 
        if(!!err) {
          logger.error('Get playerEquip failed! ' + err);
        }
        callback(err, res); // res is [] if empty
      });
    },
    playerPet: function(callback, res) {
      playerPetDao.get(mysqlc, playerId, 0, function(err, res) { // 0 for all
        if(!!err) {
          logger.error('Get playerPet failed! ' + err);
        }
        callback(err, res); // res is [] if empty
      });
    },
    playerSkill: function(callback, res) {
      playerSkillDao.get(mysqlc, playerId, 0, function(err, res) { // 0 for all
        if(!!err) {
          logger.error('Get playerSkill failed! ' + err);
        }
        callback(err, res); // res is [] if empty
      });
    },
    playerItem: function(callback) {
      playerItemDao.get(mysqlc, playerId, function(err, res) {
        if(!!err) {
          logger.error('Get playerItem failed! ' + err);
        }
        callback(err, res); // res is [] if empty
      });
    }
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
