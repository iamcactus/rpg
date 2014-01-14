var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('../util/utils');
var worldPlayerDao  = require('../dao/worldPlayerDao');
var playerEquipDao  = require('../dao/playerEquipDao');
var playerFractionDao = require('../dao/playerFractionDao');
var playerParamDao  = require('../dao/playerParamDao');
var playerItemDao   = require('../dao/playerItemDao');
var playerPetDao    = require('../dao/playerPetDao');

var async = require('async');
//var petConf = require('../../../shared/petConf');
var gameInit = require('../../../shared/gameInit');
var commonUtils = require('../../../shared/util/commonUtils');
var dataApi = require('../util/dataApi');

var PetCompoTrans = module.exports;

/**
 * Compose fraction into hero
 * @param {Object} mysqlc mysql client reference
 * @param {Number} playerId
 * @param {Number} star fraction star, also pet star
 * @param {Number} playerPetId sequence id for id in player_pet
 * @param {Number} num how many fractions used for one compo
 * @param {Number} petId pet_id in pet_data
 * @returns {Boolean} true or false
 */
PetCompoTrans.exec = function(mysqlc, playerId, star, playerPetId, num, petId, cb) {
  var type = gameInit.BAG.PET.type; // type of fraction, here is "pet"
  var typeId = commonUtils.getInitID(gameInit.BAG, type);

  star = Number(star);

  mysqlc.query('BEGIN', function(err, rows) { // start TRANSACTION
    if (err) {
      utils.invokeCallback(cb, err, null);
      return;
    }
    async.auto({
      // delete fraction
      deleteFraction: function(callback) {
        playerFractionDao.update(mysqlc, playerId, typeId, star, num, callback);
      },
      setPlayerPet: function(callback) {
        playerPetDao.add(mysqlc, playerPetId, playerId, petId, callback);
      }
    }, function(err, res) {
      var q; // query cmd
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
            console.log('[PetCompo] transaction query failed ');
            utils.invokeCallback(cb, err, null);
            return;
          }
          else {
            console.log('[PetCompo] transaction query finished');
            if (!res.deleteFraction || !res.setPlayerPet) {
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
