/**
 * Velidate World ID
 * @param  {Number} worldId
 * @returns {Boolean} 
 */

var regNum = /^[0-9]+$/;
module.exports.normalizeWorldId = function(worldId) {
  if (!worldId || !regNum.test(worldId)) {
    return false;
  }

  return worldId;
};
