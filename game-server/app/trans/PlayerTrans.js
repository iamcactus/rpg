var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('../util/utils');
var worldPlayerDao = require('../dao/worldPlayerDao');
var playerDao = require('../dao/playerDao');
var playerParam = require('../dao/playerParam');
var playerMissionLog = require('../dao/playerMissionLog');
var playerCardDao = require('../dao/playerCardDao');
var playerUnitDao = require('../dao/playerUnitDao');
var async = require('async');
var EVOLVECONF = require('../../../shared/evolveConf');

var playerTrans = module.exports;

playerTrans.initPlayer = function(mysqlc, params, cb) {
  console.log(params);
  mysqlc.query('BEGIN', function(err, rows) { // start TRANSACTION
    if (err) {
      utils.invokeCallback(cb, err, null);
      return;
    }
    async.auto({
      // init PlayerData like name,sex_type, etc
      initPlayerData: function(callback) {
        console.log('in initPlayerData:' + ' ' + params.playerId + ' ' + params.name + ' ' + params.sexType);
        playerDao.initPlayerData(mysqlc, params.playerId, params.name, params.sexType, callback);
      },
      // init PlayerParam like exp, lv, etc
      initPlayerParam: function(callback) {
        console.log('in initPlayerParam:' + ' ' + params.playerId + ' ' + params.lead);
        playerParam.init(mysqlc, params.playerId, params.lead, callback);
      },
      // init PlayerMissionLog
      initPlayerMissionLog: function(callback) {
        console.log('in initPlayerMissionLog:' + ' ' + params.playerId + ' ');
        // missionDataId:1, clearNum:0
        playerMissionLog.insert(mysqlc, params.playerId, 1, 0, callback);
      },
      // init playerCardData
      initPlayerCard: function(callback) {
        playerCardDao.add(mysqlc, params.serialId, params.playerId, params.cardId, 0, 1, 0, EVOLVECONF.THREE.INITIAL_LV, callback);
      },
      // init playerUnitData
      initPlayerUnit: ['initPlayerCard', function(callback) {
        // playerId, positionId, playerCardId
        playerUnitDao.add(mysqlc, params.playerId, 1, params.serialId, callback); 
      }]
    }, function(err, res) {
      var q; // query cmd
      if (err || !res) {
        q = 'ROLLBACK';
        console.log('[initPlayer] transaction query failed ' + err.message);
      }
      else {
        q = 'COMMIT';
      }
      mysqlc.query(q, function(err, res1) {
        if (err) {
          utils.invokeCallback(cb, err, null);
          return;
        }
        else {
          utils.invokeCallback(cb, null, res);
          return;
        }
      });
    });
  });
};
