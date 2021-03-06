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
 * get master dbhandle for game_master
 * @returns {String} master dbhandle
 */
commonUtils.masterDBW = function() {
  return DBCONF.GAME_MASTER_W;
};

/**
 * get slave dbhandle for game_master
 * @returns {String} slave dbhandle
 */
commonUtils.masterDBR = function() {
  return DBCONF.GAME_MASTER_R;
};

/**
 * get backup dbhandle for game_master
 * @returns {String} backup dbhandle
 */
commonUtils.masterDBB = function() {
  return DBCONF.GAME_MASTER_B;
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

/**
 * get small obj from array
 * @param {Array} array
 * @param {String} key
 * @param {Number} value
 * @returns {Object} the obj with the key
 * ex: array:
 * playerEquip:
 *  [ { id: 2609, player_id: 2020, equip_id: 5109, level: 10 },
 *    { id: 2610, player_id: 2020, equip_id: 5101, level: 10 }
 *  ]
 * key: id
 * value: 2609
 * get obj: 
 *   { id: 2609, player_id: 2020, equip_id: 5109, level: 10 }
 */
commonUtils.getObj = function(array, key, value) {
  if (!!array) {
    for (var i in array) {
      if (array[i][key] == value) {
        return array[i];
      }
    }
  }
  return null;
};

/* @param {object} obj like gameInit.BAG
 * @returns {number} id in gameInit for the type
 */
commonUtils.getInitID = function(obj, type) {
  if (!!obj) {
    for (var i in obj) {
      if (obj[i].type == type) {
        return obj[i].id;
      }
    }
  }
  return 0;
};
