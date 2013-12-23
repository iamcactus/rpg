/**
 *Module dependencies
 */

var util = require('util');
var playerDao = require('../../dao/playerDao');
var playerCardDao = require('../../dao/playerCardDao');
var playerUnitDao = require('../../dao/playerUnitDao');

/**
 * Initialize a new 'Player' with the given 'opts'.
 *
 * @param {Object} opts
 * @api public
 */

var PlayerUnits = function(opts) {
  this.worldId = Number(opts.worldId);
	this.playerId = Number(opts.player_id);
	this.name = opts.name;
  this.sexType = opts.sex_type;
  this.playerUnits = opts.playerUnits;
  this.playerPet = opts.playerPet;
  //this.from = opts.from || '';
	//this.lastLoginTime = opts.lastLoginTime;
};

/**
 * Expose 'Entity' constructor
 */

module.exports = Player;
