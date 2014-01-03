var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('../util/utils');
var worldPlayerDao = require('../dao/worldPlayerDao');
var playerEquipDao = require('../dao/playerEquipDao');
var playerParamDao = require('../dao/playerParamDao');
var playerItemDao = require('../dao/playerItemDao');
var playerSkillDao = require('../dao/playerSkillDao');
var async = require('async');
var cardConf = require('../../../shared/cardConf');
var gameInit = require('../../../shared/gameInit');
var dataApi = require('../util/dataApi');

var BagSellTrans = module.exports;

BagSellTrans.sell = function(mysqlc, params, playerId, typeId, cb) {
  console.log(params);
  var silver = 100;

  // TODO: formula
  var playerParam = {
    "silver": silver
  };

  var ids = [];
  for (var i in params) {
    ids.push(params[i].id);
  }

  console.log(ids);
  console.log(playerParam);

  mysqlc.query('BEGIN', function(err, rows) { // start TRANSACTION
    if (err) {
      utils.invokeCallback(cb, err, null);
      return;
    }
    async.auto({
      // set silver
      setPlayerParam: function(callback) {
        playerParamDao.update(mysqlc, playerParam, playerId, callback);
      },
      // delete item
      deleteItem: function(callback) {
        if (typeId === gameInit.BAG.EQUIP.id) {
          playerEquipDao.delMulti(mysqlc, ids, callback);
        }
        else if (typeId === gameInit.BAG.SKILL.id) {
          playerSkillDao.delMulti(mysqlc, ids, callback);
        }
        else if (typeId === gameInit.BAG.ITEM.id) {
          playerItemDao.delMulti(mysqlc, ids, callback);
        }
        else {
          callback(null, null);
        }
      }
    }, function(err, res) {
      var q; // query cmd
      if (err || !res) {
        q = 'ROLLBACK';
        console.log('[BagSell] transaction query failed ');
        console.log(err);
      }
      else {
        q = 'COMMIT';
      }
      mysqlc.query(q, function(err, res1) {
        //mysqlc.transRelease(); // TODO: test
        if (err) {
          utils.invokeCallback(cb, err, null);
          return;
        }
        else {
          console.log('[BagSell] transaction query finished');
          console.log(res);
          //mysqlc.transRelease(); // TODO: test
          utils.invokeCallback(cb, null, res);
          return;
        }
      });
    });
  });
};
