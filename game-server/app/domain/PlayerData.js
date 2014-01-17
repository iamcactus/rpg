/*
 * container for playerData
 *
 * TODO: add method 
 * 2013-2014
 * @iamcactus
 */

var util = require('util');

/**
 * Initialize a new 'Player' with the given 'opts'.
 *
 * @param {Object} opts
 * @api public
 */

var PlayerData = function(opts) {
	this.playerId = Number(opts.player_id);
	this.name     = opts.name;
  this.sexType  = opts.sex_type;
  this.createdon = opts.created_on;
  this.logo     = opts.logo;
};

module.exports = PlayerData;
