/* loginDao for node.js 
 * related table is game_master.login_data
 * 2013-2014 
 * @iamcactus
 */
var loginDao = module.exports;

/**
 * Create a new user
 * @param {Number} uid          user id
 * @param {String} deviceInfo   unique string generated by app/apk
 * @param {String} loginName    account 
 * @param {String} passwordHash encrypted password
 */
loginDao.createUser = function(mysqlc, uid, deviceInfo, loginName, passwordHash, cb) {
  var insertSQL = 
    'insert into login_data (uid, device_info, login_name, password_hash, created_on) values (?,?,?,?,?)';
  var createdOn   = Math.round(new Date().getTime()/1000); // unixtime
  var args = [uid, deviceInfo, loginName, passwordHash, createdOn];
  mysqlc.query(insertSQL, args, function(err, res) {
    console.log(res);
    if (!!err) {
      cb(err, null);
    }
    else {
      var user = {uid:uid, login_name:loginName, lastLoginTime:createdOn};
      cb(null, user);
    }
  });
};

/**
 * Get loginData by deviceInfo
 * @param {String} mysqlc handle for Master DB or Slave DB, default is Slave DB
 * @param {String} deviceInfo  unique string generate by app/apk 
 * @param {function} cb
 * @returns {Object} loginData or null
 */
loginDao.getByDeviceInfo = function(mysqlc, deviceInfo, cb) {
  var selectSQL = 'select * from login_data where device_info = ?'; 
  var args = [deviceInfo];

  mysqlc.query(selectSQL, args, function(err, res) {
    if (err !== null) {
      cb(err, null);
    }
    else {
      if (!!res && res.length === 1) {
        var rs = res[0];
        var user = {uid:rs.uid, login_name:rs.login_name};
        cb(null, user);
      }
      else {
        cb(null, null);
      }
    }
  });
};

/**
 * Get loginData by loginName
 * @param {String} mysqlc handle for Master DB or Slave DB, default is Slave DB
 * @param {String} loginName 
 * @param {function} cb
 * @returns {Object} loginData or null
 */
loginDao.getByLoginName = function(mysqlc, loginName, cb) {
  var selectSQL = 'select * from login_data where login_name = ?'; 
  var args = [loginName];

  mysqlc.query(selectSQL, args, function(err, res) {
    if (err !== null) {
      cb(err, null);
    }
    else {
      if (!!res && res.length === 1) {
        var rs = res[0];
        var user = {uid:rs.uid, login_name:rs.login_name, psw:rs.password_hash};
        cb(null, user);
      }
      else {
        cb(null, null);
      }
    }
  });
};

/**
 * Get login_data by uid
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Number} uid
 * @returns {Object} loginData or null
 */
loginDao.getByUid = function(mysqlc, uid, cb) {
  var selectSQL = 'select * from login_data where uid = ?';
  var args = [uid];
  mysqlc.query(selectSQL, args, function(err, res) {
    if (err !== null) {
      cb(err, null);
    }
    else {
      if (!!res && res.length === 1) {
        var rs = res[0];
        var loginData = {uid:rs.uid, login_name:rs.login_name};
        cb(null, loginData);
      }
      else {
        cb(null, null);
      }
    }
  });
};

/**
 * Update password_hash by userId
 * @param {String} passwordHash
 * @param {Number} userId
 */
loginDao.updatePassword = function(mysqlc, passwordHash, userId, cb) {
  var updateSQL = 'update login_data set password_hash=? where uid=?'; 
  var args = [passwordHash, userId];

  mysqlc.query(updateSQL, args, function(err, res) {
    if (err !== null) {
      cb(err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        console.log(res);
        cb(null, true);
      }
      else {
        cb(' failed ', null);
      }
    }
  });
};

