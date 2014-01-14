var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('../util/utils');
var worldPlayerDao = require('../dao/worldPlayerDao');
var playerEquipDao = require('../dao/playerEquipDao');
var playerFractionDao = require('../dao/playerFractionDao');
var playerParamDao = require('../dao/playerParamDao');
var playerItemDao = require('../dao/playerItemDao');
var playerPetDao = require('../dao/playerPetDao');
var seqPlayerPet = require('../dao/seqPlayerPet');

var async = require('async');
//var petConf = require('../../../shared/petConf');
var gameInit = require('../../../shared/gameInit');
var commonUtils = require('../../../shared/util/commonUtils');
var dataApi = require('../util/dataApi');

var PetDecompoTrans = module.exports;

PetDecompoTrans.exec = function(mysqlc, params, playerId, star, num, cb) {
  console.log(params);
  var playerPetId; // serial id in player_pet
  var petId;       // pet_id in pet_data

  var type = gameInit.BAG.PET.type; // type of fraction, here is "pet"
  var typeId = commonUtils.getInitID(gameInit.BAG, type);

  var ids = [];
  for (var i in params) {
    ids.push(params[i].id);
  }

  console.log(ids);

  mysqlc.query('BEGIN', function(err, rows) { // start TRANSACTION
    if (err) {
      utils.invokeCallback(cb, err, null);
      return;
    }
    async.auto({
      // set fraction
      addFraction: function(callback) {
        playerFractionDao.replace(mysqlc, playerId, typeId, star, num, callback);
      },
      // delete pet
      deleteItem: ['addFraction', function(callback, result) {
        if (!!result.addFraction) {
          playerPetDao.delMulti(mysqlc, ids, callback);
        }
        else {
          callback(err, null);
        }
      }]
    }, function(err, res) {
      var q; // query cmd
      console.log('-----111-----');
      console.log(res);
      if (err || !res) {
        q = 'ROLLBACK';
      }
      else {
        q = 'COMMIT';
      }
      mysqlc.query(q, function(err1, res1) {
        //mysqlc.transRelease(); // TODO: test
        if (err1) {
          utils.invokeCallback(cb, err1, null);
          return;
        }
        else {
          if (err) {
            console.log('[PetDecompo] transaction query failed ');
            console.log(err);
            utils.invokeCallback(cb, err, null);
            return;
          }
          else {
            console.log('[PetDecompo] transaction query finished');
            console.log(res);
            if (!res.addFraction || !res.deleteItem) {
              utils.invokeCallback(cb, null, false);
            }
            else {
              utils.invokeCallback(cb, null, true);
            }
          }
        }
      });
    });
  });
};
