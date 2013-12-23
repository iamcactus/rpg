var commonUtils = module.exports;
var DBCONF = require('../dbconf');
var PARAMRULES = require('../paramRules');
var dataApi = require('../../game-server/app/util/dataApi');
var iz = require('iz');
var _ = require('underscore');
var are = iz.are;
var nameEngChn = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
var nameEng = /^[a-zA-Z0-9_]+$/;

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


/** 
 * parse value into Int
 * @param {Number} val should be number, '' or String or float is parsed as 0
 * @returns {Number} val or 0
 */ 
commonUtils.chkNickName = function(name) {
  if (!name) {
    console.log(112);
    return false;
  }
  var t = name.toString();
  if (t.length > 12) {
    return false;
  }
  if (t.length === 1 && nameEng.test(t)) {
    return false;
  }

  return nameEngChn.test(t);
};

/** 
 * check a word is NGWord or not
 * @param {String} word 
 * @returns {Boolean} true if is NGWord
 */ 
commonUtils.isNGWord = function(word) {
  if (!word || false == word) {
    return true;
  }
  var tmp = word.toString();
  var list = dataApi.NGWord.all();

  var res = _.find(list, function(v) {
    return (tmp.toString().indexOf(v) >= 0);
  });

  if (res) {
    return true;
  }
  else {
    return false;
  }
};

/** 
 * get array from an object
 * @param {Object} obj
 * @param {String} key4k key for key, ex 'position_id'
 * @param {String} key4v key for value ex 'player_card_id'
 * @returns {Array} Array or []
 */ 
commonUtils.makeArray = function(obj, key4k, key4v, cb) {
  var ids = [];
  _.map(obj, function(o) {
    ids[o[key4k] - 1] = o[key4v];
  });
  cb(null, ids);
};
