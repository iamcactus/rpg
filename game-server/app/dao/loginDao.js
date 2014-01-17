var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var User = require('../domain/user');
var utils = require('../util/utils');
var consts = require('../../consts/consts');
var User = require('../domain/user');
var loginDao = module.exports;

var gdb = require('util');
/**
 * Get login_data by uid
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Number} uid
 * @returns {Object} loginData
 */
loginDao.getByUid = function (mysqlc, uid, cb) {
  var selectSQL = 'select * from login_data where uid = ?';
  var args = [uid];

  mysqlc.query(selectSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err, null);
      return;
    }

    if (!!res && res.length === 1) {
      var rs = res[0];
      var loginData = {uid:rs.uid, login_name:rs.login_name};
      utils.invokeCallback(cb, null, loginData);
    }
    else {
      utils.invokeCallback(cb, null, null);
    }
  });
};
