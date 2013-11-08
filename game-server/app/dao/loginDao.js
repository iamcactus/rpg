var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
//var dataApi = require('../util/dataApi');
//var Player = require('../domain/entity/player');
var User = require('../domain/user');
//var consts = require('../consts/consts');
//var equipmentsDao = require('./equipmentsDao');
//var bagDao = require('./bagDao');
//var fightskillDao = require('./fightskillDao');
//var taskDao = require('./taskDao');
//var async = require('async');
var utils = require('../util/utils');
var consts = require('../../consts/consts');
var User = require('../domain/user');
var loginDao = module.exports;

var gdb = require('util');
/**
 * Get login_data by device_info
 * @param {String} dbhandle handle for Master DB or Slave DB
 * @param {String} device_info  unique string generate by app/apk 
 * @returns {Object} login_data or Object with res:0
 */
loginDao.getLoginDataByDeviceInfo = function (dbhandle, device_info, cb) {
  var mysqlc = pomelo.app.get(dbhandle);

  var selectSQL = 'select * from login_data where device_info = ?'; 
  var args = [device_info];
  console.log("------222-------");
  console.log(device_info);

  console.log(gdb.inspect(mysqlc));
  mysqlc.query(selectSQL, args, function(err, res) {
    console.log("------333-------");
    if (err !== null) {
    console.log("------444-------");
      console.log(err);
      console.log(device_info);
      utils.invokeCallback(cb, err.message, null);
    }
    else {
    console.log("------555-------");
    console.log(gdb.inspect(res));
      if (!!res && res.length === 1) {
        console.log('in if');
        console.log(res);
        var rs = res[0];
        var user = new User({id:rs.uid, name:rs.login_name});
        utils.invokeCallback(cb, null, user);
      }
      else {
        console.log('in else');
        console.log(gdb.inspect(cb));
        console.log("------666-------");
        console.log(gdb.inspect(user));
        utils.invokeCallback(cb, null, null);
      }
    }
  });
};

/**
 * Get login_data by login_name
 * @param {String} dbhandle handle for Master DB or Slave DB
 * @param {String} login_name user loing account, unique string
 * @returns {Object} login_data or Object with res:0
 */
loginDao.getLoginDataByLoginName = function (dbhandle, login_name, cb) {
  var mysqlc = pomelo.app.get(dbhandle);

  var selectSQL = 'select * from login_data where login_name = ?'; 
  var args = [login_name];

  mysqlc.query(selectSQL, args, function(err, res) {
    if (err !== null) {
      console.log(err);
      console.log(device_info);
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.length === 1) {
        console.log('in if');
        console.log(res);
        var rs = res[0];
        var user = new User({id:rs.uid, name:rs.login_name});
        utils.invokeCallback(cb, null, user);
      }
      else {
        console.log('in else');
        utils.invokeCallback(cb, ' user not exist ', null);
      }
    }
  });
};

/**
 * Get login_data by uid
 * @param {String} dbhandle handle for Master DB or Slave DB
 * @param {Number} uid
 * @returns {Object} loginData
 */

loginDao.getLoginDataByUid = function (dbhandle, uid, cb) {
  var mysqlc = pomelo.app.get(dbhandle);
  var selectSQL = 'select * from login_data where uid = ?';
  var args = [uid];

  mysqlc.query(selectSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err.message, null);
      return;
    }

    if (!!res && res.length === 1) {
      utils.invokeCallback(cb, null, new User(res[0]));
    }
    else {
      utils.invokeCallback(cb, null, null);
    }
  });
}

/**
 * Update password_hash by uid
 * @param {String} password_hash
 * @param {Number} uid
 */
loginDao.updatePassword = function (password_hash, uid, cb) {
  var updateSQL = 'update login_data set password_hash=? where uid=?'; 
  var args = [password_hash, uid];

  pomelo.app.get('game_master_m').query(updateSQL, args, function(err, res) {
    if (err !== null) {
      console.log(err);
      console.log(device_info);
      utils.invokeCallback(cb, err.message, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        console.log('in if');
        console.log(res);
        utils.invokeCallback(cb, null, true);
      }
      else {
        console.log('in else');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

