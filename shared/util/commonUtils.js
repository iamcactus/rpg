var commonUtils = module.exports;
var DBCONF = require('../dbconf');
var PARAMRULES = require('../paramRules');
var iz = require('iz');
var are = iz.are;

/**
 * Velidate World ID
 * @param  {Number} worldId
 * @returns {Boolean} 
 */
var regNum = /^[0-9]+$/;
commonUtils.normalizeWorldId = function(worldId) {
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
commonUtils.worldDBW = function(worldId) {
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
commonUtils.worldDBR = function(worldId) {
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
  return null;
};

/**
 * get backup dbhandle for worldId 
 * @param  {Number} worldId
 * @returns {String} backup dbhandle
 */
commonUtils.worldDBB = function(worldId) {
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
  return null;
};

/**
 * validate the request parameters by 'iz'
 * @param {String} key for target handler
 * @param {Object} request parameters
 */
commonUtils.validate = function(key, param) {
  if (iz.empty(key) || iz.empty(param)) {
    return false;
  }
  console.log(param);
  var rules = PARAMRULES[key];
  try {
    return are(PARAMRULES[key]).validFor(param);
  }
  catch (err) {
    return false;
  }
};

/** 
 * parse value into Int
 * @param {Number} val should be number, '' or String or float is parsed as 0
 * @returns {Number} val or 0
 */ 
commonUtils.parseNumber = function(val) {
  return isNaN(parseInt(val)) ? 0 : parseInt(val);
};
