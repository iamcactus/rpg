/**
 *Module dependencies
 */

var util = require('util');

/**
 * Initialize a new 'Player' with the given 'opts'.
 *
 * @param {Object} opts
 * @api public
 */

var Player = function(opts) {
	this.id = opts.uid;
	this.name = opts.name;
  this.sexType = opts.sex_type;
  //this.from = opts.from || '';
	//this.lastLoginTime = opts.lastLoginTime;
};

/**
 * Expose 'Entity' constructor
 */

module.exports = Player;
