/* Initiation NPC data into game_world_xxx
 * All configuration is defiend in NPCconf.json
 */

var fs      = require('fs');
var mysql   = require('mysql');
var async   = require('async');
var util    = require('util');
var NPCconf = require('./NPCconf');

var playerCardDao   = require('../../game-server/app/dao/playerCardDao');
var playerUnitDao   = require('../../game-server/app/dao/playerUnitDao');
var playerPetDao    = require('../../game-server/app/dao/playerPetDao');
var playerEquipDao  = require('../../game-server/app/dao/playerEquipDao');
var playerSkillDao  = require('../../game-server/app/dao/playerSkillDao');
var unitMeridianDao = require('../../game-server/app/dao/unitMeridianDao');
var dataApi         = require('../../game-server/app/util/dataApi');

var connecMaster = mysql.createConnection(
  {
    host      : '127.0.0.1',
    user      : 'onemore',
    password  : 'onemore01',
    database  : 'game_master',
    insecureAuth: true
  }
);

var connecWorld = mysql.createConnection(
  {
    host      : '127.0.0.1',
    user      : 'onemore',
    password  : 'onemore01',
    database  : 'game_world_1001',
    insecureAuth: true
  }
);

// obj: array for unit_meridian
var insertMeridian = function(mysqlc, obj, playerCardId, cb) {
  var insertSQL =
      'insert into unit_meridian(player_card_id, position_id, stone_id, created_on, updated_on) values (?,?,?, ?,?)';
  var createdOn = Math.round(new Date().getTime()/1000); //unixtime
  var updatedOn = createdOn;
  async.map(obj, function(item, callback) {
    var args = [playerCardId, item.position, item.stone, createdOn, updatedOn];
    mysqlc.query(insertSQL, args, function(err, res) {
      if (err) {
        callback(err, null);
      }
      else {
        callback(null, res);
      }
    });
  }, function(err, res) {
    if (err) {
      cb(err, null);
    }
    else {
      cb(null, res);
    }
  });
};

connecMaster.connect();
connecWorld.connect();

var BASEID      = 2000;   // all id is using this one, dont edit it
var UNIT_LENGTH  = 8;     // all id is using this one, dont edit it
var EQUIP_LENGTH = 4;     // all id is using this one, dont edit it
var SKILL_LENGTH = 2;     // all id is using this one, dont edit it
var STONE_LENGTH = 5;     // all id is using this one, dont edit it
// parametor initiation
var TYPE_HP  = 1; // jewelry
var TYPE_ATK = 2; // weapon
var TYPE_DEF = 3; // defender
var TYPE_AGI = 4; // shoe

var missionId = NPCconf.mission_data_id;
var playerId  = BASEID + missionId;
var unit  = NPCconf.player_unit;
var pet   = NPCconf.player_pet;

// unit: Array of player_unit
var makeUnit = function(mysqlc, unit, playerId, cb) {

  var i = -1;

  async.map(unit, function(item, callback) {
    var positionId    = item.position; // current position in the unit
    var playerCardId  = BASEID + positionId + ((missionId - 1) * UNIT_LENGTH);
    i++;

    console.log("playerCardId : " + playerCardId);
    console.log("positionId : " + positionId);

    var weaponId    = 0;
    var defenderId  = 0;
    var shoeId      = 0;
    var jewelryId   = 0;
    var stdskill1Id = 0;
    var stdskill2Id = 0;

    var card  = item.card;
    var unitMeridian = card[0].unit_meridian; // Jing Mai

    async.auto({
      um: function(callback) {
        insertMeridian(mysqlc, unitMeridian, playerCardId, callback);
      },
      card: function(callback) {
        // insert player_card
        playerCardDao.add(mysqlc, playerCardId, playerId, card[0].id, 0, card[0].level, 100, 
          function(err, res) {
            if (err) {
              callback(err, null);
            }
            playerCardDao.arm(mysqlc, playerCardId, callback);
          }
        );
      },
      weapon: function(callback) {
        var weapon = item.weapon;
        if (weapon[0].id > 0) {
          var playerEquipId = BASEID + ((missionId - 1) * EQUIP_LENGTH * UNIT_LENGTH) + i * EQUIP_LENGTH + TYPE_ATK;
          weaponId = playerEquipId;
          //console.log("weapon playerEquipId : " + playerEquipId);
          playerEquipDao.add(
            mysqlc, 
            playerEquipId, playerId, 
            weapon[0].id, weapon[0].level,
            function(err, res) {
              if (err) {
                callback(err, null);
              }
              playerEquipDao.arm(mysqlc, playerEquipId, callback);
            }
          );
        }
        else {
          callback(null, null);
        }
      },
      defender: function(callback) {
        var defender = item.defender;
        if (defender[0].id > 0) {
          var playerEquipId = BASEID + ((missionId - 1) * EQUIP_LENGTH * UNIT_LENGTH) + i * EQUIP_LENGTH + TYPE_DEF;
          defenderId = playerEquipId;
          //console.log("defender playerEquipId : " + playerEquipId);

          playerEquipDao.add(
            mysqlc, 
            playerEquipId, playerId, 
            defender[0].id, defender[0].level,
            function(err, res) {
              if (err) {
                callback(err, null);
              }
              playerEquipDao.arm(mysqlc, playerEquipId, callback);
            }
          );
        }
        else {
          callback(null, null);
        }
      },
      shoe: function(callback) {
        var shoe = item.shoe;
        if (shoe[0].id > 0) {
          var playerEquipId = BASEID + ((missionId - 1) * EQUIP_LENGTH * UNIT_LENGTH) + i * EQUIP_LENGTH + TYPE_AGI;
          shoeId = playerEquipId;
          //console.log("shoe playerEquipId : " + playerEquipId);
          playerEquipDao.add(
            mysqlc, 
            playerEquipId, playerId, 
            shoe[0].id, shoe[0].level,
            function(err, res) {
              if (err) {
                callback(err, null);
              }
              playerEquipDao.arm(mysqlc, playerEquipId, callback);
            }
          );
        }
        else {
          callback(null, null);
        }
      },
      jewelry: function(callback) {
        var jewelry = item.jewelry;
        if (jewelry[0].id > 0) {
          var playerEquipId = BASEID + ((missionId - 1) * EQUIP_LENGTH * UNIT_LENGTH) + i * EQUIP_LENGTH + TYPE_HP;
          jewelryId = playerEquipId;
          //console.log("jewelry playerEquipId : " + playerEquipId);
          playerEquipDao.add(
            mysqlc, 
            playerEquipId, playerId, 
            jewelry[0].id, jewelry[0].level,
            function(err, res) {
              if (err) {
                callback(err, null);
              }
              playerEquipDao.arm(mysqlc, playerEquipId, callback);
            }
          );
        }
        else {
          callback(null, null);
        }
      },
      stdskill1: function(callback) {
        var stdskill1 = item.stdskill1;
        if (stdskill1[0].id > 0) {
          var playerSkillId = BASEID + ((missionId - 1) * SKILL_LENGTH * UNIT_LENGTH) + i * SKILL_LENGTH + 1;
          stdskill1Id = playerSkillId;
          //console.log("skill1 Id : " + playerSkillId + ", id:" + stdskill1[0].id + ", level:" + stdskill1[0].level);
          playerSkillDao.add(
            mysqlc, 
            playerSkillId, playerId, 
            stdskill1[0].id, 0, stdskill1[0].level,
            function(err, res) {
              if (err) {
                callback(err, null);
              }
              playerSkillDao.arm(mysqlc, playerSkillId, callback);
            }
          ); // 0: exp = 0
        }
        else {
          callback(null, null);
        }
      },
      stdskill2: function(callback) {
        var stdskill2 = item.stdskill2;
        if (stdskill2[0].id > 0) {
          var playerSkillId = BASEID + ((missionId - 1) * SKILL_LENGTH * UNIT_LENGTH) + i * SKILL_LENGTH + 2;
          stdskill2Id = playerSkillId;
          //console.log("skill2 Id : " + playerSkillId);
          playerSkillDao.add(
            mysqlc, 
            playerSkillId, playerId, 
            stdskill2[0].id, 0, stdskill2[0].level,
            function(err, res) {
              if (err) {
                callback(err, null);
              }
              playerSkillDao.arm(mysqlc, playerSkillId, callback);
            }
          ); // 0: exp = 0
        }
        else {
          callback(null, null);
        }
      }
    }, function(err, res) {
      if (err) {
        console.log('NPCgenerator failed');
        console.log(err);
        callback(err, null);
      }
      else {
        playerUnitDao.add(mysqlc, playerId, positionId, playerCardId, function(err, res10) {
          if (err) {
            callback(err, null);
          }
          // 1~6 is the equip/skill position of the here sceren
          async.series([
            function(callback1) {
              if (weaponId) {
                playerUnitDao.arm(mysqlc, playerId, positionId, 3, weaponId, callback1);
              }
              else {
                callback1(null, null);
              }
            },
            function(callback1) {
              if (defenderId) {
                playerUnitDao.arm(mysqlc, playerId, positionId, 4, defenderId, callback1);
              }
              else {
                callback1(null, null);
              }
            },
            function(callback1) {
              if (shoeId) {
                playerUnitDao.arm(mysqlc, playerId, positionId, 5, shoeId, callback1);
              }
              else {
                callback1(null, null);
              }
            },
            function(callback1) {
              if (jewelryId) {
                playerUnitDao.arm(mysqlc, playerId, positionId, 6, jewelryId, callback1);
              }
              else {
                callback1(null, null);
              }
            },
            function(callback1) {
              if (stdskill1Id) {
                playerUnitDao.arm(mysqlc, playerId, positionId, 1, stdskill1Id, callback1);
              }
              else {
                callback1(null, null);
              }
            },
            function(callback1) {
              if (stdskill2Id) {
                playerUnitDao.arm(mysqlc, playerId, positionId, 2, stdskill2Id, callback1);
              }
              else {
                callback1(null, null);
              }
            }
          ],
          function(err, res11) {
            if (err) {
              callback(err, null);
            }
            callback(null, res);
          });
        });
        //console.log("makeUnit done");
        //console.log(res);
        //callback(null, res);
      }
    });
  }, function(err, res) {
    if (err) {
      console.log(err);
      cb(err, null);
    }
    else {
      cb(null, res);
    }
  });
};

// pet: Array of player_pet
var makePet = function(mysqlc, pet, playerId, cb) {
  async.map(pet, function(item, callback) {
    var petId = item.id; // current position in the unit
    var level = item.level; 
    var id    = playerId; // id in player_pet

    //console.log("id : " + id);
    async.auto({
      pp: function(callback) {
        playerPetDao.add(mysqlc, id, playerId, petId, cb);
      },
      arm: ['pp', function(callback) {
        playerPetDao.arm(mysqlc, id, cb);
      }]
    }, function(err, res) {
      if (err) {
        //console.log('unitMeridianDao.init failed' + err);
        callback(err, null);
      }
      else {
        callback(null, res);
      }
    });
  }, function(err, res) {
    if (err) {
      console.log(err);
      cb(err, null);
    }
    else {
      cb(null, res);
    }
  });
};

connecWorld.query('BEGIN', function(err, rows) {
  if (err) {
    console.log('start trans failed' + err);
  }
  async.auto({
    makeUnit: function(cb) {
      makeUnit(connecWorld, unit, playerId, cb);
    },
    makePet: function(cb) {
      makePet(connecWorld, pet, playerId, cb);
    }
  }, function(err, res) {
    var q; // query
    if (err) {
      q = 'ROLLBACK';
      console.log('unitMeridianDao.init failed' + err);
    }
    else {
      q = 'COMMIT';
    }
    connecWorld.query(q, function(err, rows) {
      console.log("end");
      if (err) {
        console.log('commit error');
        console.log(err);
      }
      connecWorld.end();
      connecMaster.end();
    });
  });
});
