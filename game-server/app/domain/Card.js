/*
 * container for playerCard
 *
 * TODO: add method
 * 2013-2014
 * @iamcactus
 */

var util = require('util');
var levelConf = require('../../../shared/levelConf');

/**
 * Initialize a new 'Card' with the given 'opts'.
 *
 * @param {Object} opts
 * @api public
 */

var Card = function(opts) {
  this.id         = Number(opts.id);
  this.playerId   = Number(opts.player_id);
  this.cardId     = Number(opts.card_id);
  this.exp        = Number(opts.exp);
  this.level      = Number(opts.level);
  this.evolvedCnt = Number(opts.evolved_cnt);
  this.maxLevel   = Number(opts.max_level);
  this.isOnarm    = opts.is_onarm; 
  this.createdOn  = opts.created_on;
  this.updatedOn  = opts.updated_on;
};

module.exports = Card;
