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
	this.playerId = Number(opts.player_id);
	this.name = opts.name;
  this.sexType = opts.sex_type;
  this.worldId = Number(opts.worldId);

  this.playerParam    = opts.playerParam;   // player_param
  this.playerCardIds  = opts.playerCardIds; // the cards in player unit
  this.playerCard     = opts.playerCard;    // card_data for the cards
  this.playerEquip    = opts.playerEquip;   // equip_data for the equips in player unit
  this.playerMeridian = opts.playerMeridian;  // stones in player unit
  this.playerPet      = opts.playerPet;     // pet_data in player unit
  this.playerSkill    = opts.playerSkill;     // skill_data in player unit
  this.playerUnit     = opts.playerUnit;    // unit_data 
  //this.from = opts.from || '';
	//this.lastLoginTime = opts.lastLoginTime;
};

/**
 * Expose 'Entity' constructor
 */

module.exports = Player;
