var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('../util/utils');
var playerDao = require('../dao/playerDao');
var playerParamDao = require('../dao/playerParamDao');
var playerMissionLog = require('../dao/playerMissionLog');
var playerCardDao = require('../dao/playerCardDao');
var playerUnitDao = require('../dao/playerUnitDao');
var async = require('async');
var cardConf = require('../../../shared/cardConf');
var dataApi = require('../util/dataApi');

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
        playerParamDao.init(mysqlc, params.playerId, params.lead, callback);
      },
      // init PlayerMissionLog
      initPlayerMissionLog: function(callback) {
        console.log('in initPlayerMissionLog:' + ' ' + params.playerId + ' ');
        // missionDataId:1, clearNum:0
        playerMissionLog.insert(mysqlc, params.playerId, 1, 0, callback);
      },
      // init playerCardData
      initPlayerCard: function(callback) {
        var cardData = dataApi.card.findBy('card_id', params.cardId);
        var alpha = cardConf.getAlpha(cardData.star);
        playerCardDao.add(mysqlc, params.serialId, params.playerId, params.cardId, 0, 1, alpha.INITIAL_LV, callback);
      },
      // init playerUnitData
      initPlayerUnit: ['initPlayerCard', function(callback) {
        // playerId, positionId: default is 1, playerCardId
        playerUnitDao.add(mysqlc, params.playerId, 1, params.serialId, callback); 
      }]
    }, function(err, res) {
      var q; // query cmd
      if (!!res.initPlayerData && 
          !!res.initPlayerParam && 
          !!res.initPlayerMissionLog && 
          !!res.initPlayerCard && 
          !!res.initPlayerUnit) 
      {
        q = 'COMMIT';
      }
      else {
        q = 'ROLLBACK';
      }
      mysqlc.query(q, function(err1, res1) {
        if (err1) {
          utils.invokeCallback(cb, err1, null);
          return;
        }
        else {
          if (err) {
            utils.invokeCallback(cb, err, null);
            return;
          }
          else {
            if (!!res.initPlayerData && 
                !!res.initPlayerParam && 
                !!res.initPlayerMissionLog && 
                !!res.initPlayerCard && 
                !!res.initPlayerUnit) 
            {
              console.log('[initPlayer] transaction query finished');
              utils.invokeCallback(cb, null, true);
            }
            else {
              utils.invokeCallback(cb, null, false);
            }
          }
        }
      }); // end of mysqlc.query(q
    }); // end of async.auto
  }); // end of mysqlc.query('BEGIN'
};
