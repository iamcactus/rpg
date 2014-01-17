/*
 * container for playerParam
 *
 * TODO: add method for vip, mission, power, etc
 * 2013-2014
 * @iamcactus
 */

var util = require('util');
var levelConf = require('../../../shared/levelConf');

/**
 * Initialize a new 'Player' with the given 'opts'.
 *
 * @param {Object} opts
 * @api public
 */

var PlayerParam = function(opts) {
  this.playerId   = Number(opts.player_id);
  this.vipLevel   = Number(opts.vip_level);
  this.vipExp     = Number(opts.vip_exp);
  this.level      = Number(opts.level);
  this.exp        = Number(opts.exp);
  this.missionDataId  = Number(mission_data_id);
  this.gold       = Number(opts.gold);
  this.silver     = Number(opts.silver);
  this.maxPower  = Number(opts.max_power);
  this.powerRecoveredOn = opts.power_recovered_on; 
  this.maxEnergy = Number(opts.max_energy);
  this.energyRecoveredOn= opts.energy_recovered_on; 
  this.lead       = Number(opts.lead);
  this.power      = Number(opts.power);
  this.energy     = Number(opts.energy);
  if (!!opts.level) {
    this.levelConf  = levelConf(opts.level);
  }
};

module.exports = PlayerParam;
