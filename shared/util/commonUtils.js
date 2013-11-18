var commonUtils = module.exports;
var DBCONF = require('../dbconf');

/**
 * Velidate World ID
 * @param  {Number} worldId
 * @returns {Boolean} 
 */
var regNum = /^[0-9]+$/;
commonUtils.normalizeWorldId = function (worldId) {
  if (!worldId || !regNum.test(worldId)) {
    return false;
  }

  return worldId;
};

/**
 * get master dbhandle for worldId 
 * @param  {Number} worldId
 * @returns {String} master dbhandle
 */
commonUtils.worldDBW = function (worldId) {
  if (!worldId || !regNum.test(worldId)) {
    return null;
  }
 
  for (var dbhandle in DBCONF) {
    var str = worldId + '_W';
    var d = dbhandle.toString();
    if (d.match(str)) {
      return DBCONF[d];
    }
  }
  return null;
};

/**
 * get slave dbhandle for worldId 
 * @param  {Number} worldId
 * @returns {String} slave dbhandle
 */
commonUtils.worldDBR = function (worldId) {
  if (!worldId || !regNum.test(worldId)) {
    return null;
  }
 
  for (var dbhandle in DBCONF) {
    var str = worldId + '_R';
    var d = dbhandle.toString();
    if (d.match(str)) {
      return DBCONF[d];
    }
  }
  return null
};

/**
 * get backup dbhandle for worldId 
 * @param  {Number} worldId
 * @returns {String} backup dbhandle
 */
commonUtils.worldDBB = function (worldId) {
  if (!worldId || !regNum.test(worldId)) {
    return null;
  }
 
  for (var dbhandle in DBCONF) {
    var str = worldId + '_B';
    var d = dbhandle.toString();
    if (d.match(str)) {
      return DBCONF[d];
    }
  }
  return null
};
