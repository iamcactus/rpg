// Generate mission_equip into json
// the json will be read as an Object by dataApi

var fs = require('fs');
var mysql = require('mysql');
var async = require('async');
var util = require('util');
var connection = mysql.createConnection(
  {
    host      : '127.0.0.1',
    user      : 'onemore',
    password  : 'onemore01',
    database  : 'game_master',
    insecureAuth: true
  }
);
var equipOutput     = 'equip.json';

var weaponOutput    = 'weapon.json';
var defenderOutput  = 'defender.json';
var shoeOutput      = 'shoe.json';
var jewelryOutput   = 'jewelry.json';

connection.connect();

var selectEQUIPSQL = 'select * from equip_data';

var selectWeaponSQL   = 'select * from equip_data where type = 2';
var selectDefenderSQL = 'select * from equip_data where type = 3';
var selectShoeSQL     = 'select * from equip_data where type = 4';
var selectJewelrySQL    = 'select * from equip_data where type = 1';

async.auto({
  equip: function (callback) {
    connection.query(selectEQUIPSQL, function (err, res) {
      callback(err, res);
    });
  },
  weapon: function (callback) {
    connection.query(selectWeaponSQL, function (err, res) {
      callback(err, res);
    });
  },
  defender: function (callback) {
    connection.query(selectDefenderSQL, function (err, res) {
      callback(err, res);
    });
  },
  shoe: function (callback) {
    connection.query(selectShoeSQL, function (err, res) {
      callback(err, res);
    });
  },
  jewelry: function (callback) {
    connection.query(selectJewelrySQL, function (err, res) {
      callback(err, res);
    });
  }
}, function (err, res) {
  if (err) throw err;
  //console.log(res);
  //console.log(JSON.stringify(md));

  fs.writeFile(equipOutput, JSON.stringify(res.equip), function(err) {
    if (err) {
      throw err;
    }
    else {
      console.log('all equip data is output into ' + equipOutput);
      //console.log(md);
    }
  });

  fs.writeFile(weaponOutput, JSON.stringify(res.weapon), function(err) {
    if (err) {
      throw err;
    }
    else {
      console.log('weapon data is output into ' + weaponOutput);
      //console.log(md);
    }
  });
  fs.writeFile(defenderOutput, JSON.stringify(res.defender), function(err) {
    if (err) {
      throw err;
    }
    else {
      console.log('defender data is output into ' + defenderOutput);
      //console.log(md);
    }
  });
  fs.writeFile(jewelryOutput, JSON.stringify(res.jewelry), function(err) {
    if (err) {
      throw err;
    }
    else {
      console.log('jewelry data is output into ' + jewelryOutput);
      //console.log(md);
    }
  });
  fs.writeFile(shoeOutput, JSON.stringify(res.shoe), function(err) {
    if (err) {
      throw err;
    }
    else {
      console.log('shoe data is output into ' + shoeOutput);
      //console.log(md);
    }
  });

});

connection.end();
