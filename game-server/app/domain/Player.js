/*
 * container for playerData
 *
 * TODO: add method 
 * 2013-2014
 * @iamcactus
 */

var util = require('util');
var PlayerData  = require('./PlayerData');
var PlayerParam = require('./PlayerParam');

var formula = require('../../app/util/formula');
var gameInit = require('../../../shared/gameInit');

/**
 * Initialize a new 'Player' with the given 'opts'.
 *
 * @param {Object} opts
 * @api public
 */
var Player = function(opts) {
  this.playerData   = new PlayerData(opts.playerData);
  this.playerParam  = new PlayerParam(opts.playerParam);
};

module.exports = Player;

/**
 * Parse String to json for "userinfo" in KN
 *
 * @return {Object}
 */
Player.prototype.toJSON4USERINFO = function() {
  //var timeStamp = Math.round(new Date().getTime()/1000); //unixtime
  var exp = this.playerParam.exp;
  var lv  = this.playerParam.level;
  var curExp  = formula.currentExp(exp, lv);
  var lvupExp = formula.lvupExp(exp, lv);

  return {
    playerId: this.playerData.playerId,
    name:     this.playerData.name,
    sex:      this.playerData.sexType,
    reg_time: this.playerData.createdon,
    exp:      exp,
    lv:       lv,
    cur_exp:  curExp,
    lvup_exp: lvupExp,
    //login_ts: timeStamp,
    logo:     this.playerData.logo
  };
};

/**
 * Parse String to json for "vipinfo" in KN
 *
 * @return {Object}
 */
Player.prototype.toJSON4VIPINFO = function() {
  var exp = this.playerParam.vipExp;
  var lv  = this.playerParam.vipLevel;
  var curExp  = formula.currentVipExp(exp, lv);
  var lvupExp = formula.lvupVipExp(exp, lv);

  return {
    lv:       lv,
    cur_exp:  curExp,
    lvup_exp: lvupExp,
    vipmax:   gameInit.VIP.MAXLV
  };
};

/**
 * Parse String to json for "account" in KN
 *
 * @return {Object}
 */
Player.prototype.toJSON4ACCOUNT = function() {
  var exp = this.playerParam.vipExp;
  var lv  = this.playerParam.vipLevel;

  return {
    silver: this.playerParam.silver,
    gold:   this.playerParam.gold
  };
};

/**
 * Parse String to json for "power" in KN
 * @param {Number} timeStamp unix time
 * @return {Object}
 */
Player.prototype.toJSON4POWER = function(timeStamp) {
  var power     = this.playerParam.power;
  var maxPower  = this.playerParam.maxPower;

  var nextRecoverTime = 0; // unix time
  var allRecoverTime  = 0; // unix time
  var speed = 0; // recover speed in seconds

  // condition one: timeStamp of now is less than powerRecoveredOn
  // condition two: power is less than maxPower. 
  // there might be case of more power than maxPower
  if (timeStamp < this.playerParam.powerRecoveredOn && power < maxPower) {
    var p = this.playerParam.powerRecoveredOn;
    nextRecoverTime = formula.nextRecoverTime(timeStamp, p, this.playerParam.level);
    allRecoverTime  = p - timeStamp;
  }

  if (this.playerParam.levelConf) {
    speed = this.playerParam.levelConf.POWER_RECOVER;
  }

  return {
    time:   timeStamp,
    num:    this.playerParam.power,
    max:    this.playerParam.maxPower,
    recover_num:  'what is this',
    speed:  speed,
    next_recover_time : nextRecoverTime,
    all_recover_time  : allRecoverTime
  };
};

