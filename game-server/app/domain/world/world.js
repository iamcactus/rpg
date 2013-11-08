var pomelo = require('pomelo');
var utils = require('../../util/utils');
var Timer = require('./timer');
var logger = require('pomelo-logger').getLogger(__filename);

/** Init world
 * @param {Object} opts
 * @api public
 */

var Instance = function (opts) {
  this.world = {
    w001 = {
      worldId = 1001,
      name    = "zoo1001",
      onOff   = 1,
      population = 0,
    },
    w002 = {
      worldId = 1001,
      name    = "zoo1001",
      onOff   = 1,
      population = 0,
    },
  };
};

module.exports = Instance;
