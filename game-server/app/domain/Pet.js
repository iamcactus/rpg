/*
 * container for playerPet
 *
 * TODO: add method
 * 2013-2014
 * @iamcactus
 */

var util = require('util');
var levelConf = require('../../../shared/levelConf');

/**
 * Initialize a new 'Pet' with the given 'opts'.
 *
 * @param {Object} opts
 * @api public
 */

var Pet = function(opts) {
  this.id         = Number(opts.id);
  this.playerId   = Number(opts.player_id);
  this.petId      = Number(opts.pet_id);
  this.exp        = Number(opts.exp);
  this.level      = Number(opts.level);
  this.evolvedCnt = Number(opts.evolved_cnt);
  this.maxLevel   = Number(opts.max_level);
  if (!!opts.posi_skill1_id) {
    this.posiSkill1ID = Number(opts.posi_skill1_id);
  }
  if (!!opts.posi_skill2_id) {
    this.posiSkill2ID = Number(opts.posi_skill2_id);
  }
  if (!!opts.posi_skill3_id) {
    this.posiSkill3ID = Number(opts.posi_skill3_id);
  }
  if (!!opts.nega_skill1_id) {
    this.negaSkill1ID = Number(opts.nega_skill1_id);
  }
  if (!!opts.nega_skill2_id) {
    this.negaSkill2ID = Number(opts.nega_skill2_id);
  }
  if (!!opts.nega_skill3_id) {
    this.negaSkill3ID = Number(opts.nega_skill3_id);
  }
  this.isOnarm      = opts.is_onarm; 
  this.createdOn    = opts.created_on;
  this.updatedOn    = opts.updated_on;
};

module.exports = Pet;
