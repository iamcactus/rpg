// test for playerUnitDao.js

var async = require('async');
var mysql = require('mysql');
var util = require('util');
var playerUnitAllData = require('../../../app/dao/union/playerUnitAllData');
var playerAllData = require('../../../app/dao/union/playerAllData');
var PlayerUnit    = require('../../../app/domain/PlayerUnit');
var Bag    = require('../../../app/domain/Bag');
var Player = require('../../../app/domain/Player');

var connection = mysql.createConnection(
  {
    host      : '127.0.0.1',
    user      : 'onemore',
    password  : 'onemore01',
    database  : 'game_world_1001',
    insecureAuth: true
  }
);

// pre set
//var uid       = 2015;
//var uid       = 2020;
var uid       = 10035;
var worldId   = 1001;
var playerId  = uid;

connection.connect();

  // begin transcation
  connection.query('BEGIN', function(err, rows) {
    if (err) {
	  	console.log('transaction begin failed');
      console.log(err);
			return;
    }
 
    async.auto({
      unitAllData: function(callback) {
        playerAllData.get(connection, playerId, callback);
//        playerUnitAllData.get(connection, playerId, callback);
      }
    },
    function(err, res) {
      var q; // query
      if (err) {
        q = 'ROLLBACK';
  	  	console.log('transaction query failed ');
        console.log(err);
      }
      else {
        q = 'COMMIT';
      }
      connection.query(q, function(err, res1) {
        if (err) {
        }
        else {
          if (!!res.unitAllData) {
            //if (!!res.unitAllData.playerUnit) {
              var unitObj = new PlayerUnit(res.unitAllData);
              var formation = unitObj.toJSON4FORMATION();
              console.log(formation);
  
              var dress = unitObj.toJSON4DRESS();
              console.log(dress);
  
              var PlayerBag = new Bag(res.unitAllData);
              var bagEquip =  PlayerBag.toJSON4EQUIP();
              console.log(bagEquip);
  
              var bagPet = PlayerBag.toJSON4PET();
              console.log(bagPet);
  
              var bagCard = PlayerBag.toJSON4GENERAL();
              console.log(bagCard);
  
              var bagItem = PlayerBag.toJSON4PROP();
              console.log(bagItem);
            //}
            //console.log(res.unitAllData.playerData);
            //if (!!res.unitAllData.playerData && !!res.unitAllData.playerParam) {
              var PlayerData  = new Player(res.unitAllData);
              var userinfo    = PlayerData.toJSON4USERINFO();
              var vipinfo     = PlayerData.toJSON4VIPINFO();
              var account     = PlayerData.toJSON4ACCOUNT();
              var power       = PlayerData.toJSON4POWER();
              console.log(PlayerData);
              console.log(userinfo);
              console.log(vipinfo);
              console.log(account);
              console.log(power);
            //}
          }
          else {
  	  	    console.log('transaction wrong res');
          }
          connection.end();
        }
      });
    });
  });
