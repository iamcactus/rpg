/**
 *Module dependencies
 */

var util = require('util');

/**
 * Initialize a new 'Bag' with the given 'opts'.
 *
 * @param {Object} opts
 * @api public
 */

var Bag = function(opts) {
	this.playerId = Number(opts.playerId);
  this.playerCard     = opts.playerCard;    // card_data
  this.playerEquip    = opts.playerEquip;   // equip_data
  this.playerPet      = opts.playerPet;     // pet_data
  this.playerSkill    = opts.playerSkill;   // skill_data
  this.playerItem     = opts.playerItem;    // item_data 
};

/**
 * Expose 'Entity' constructor
 */

module.exports = Bag;
