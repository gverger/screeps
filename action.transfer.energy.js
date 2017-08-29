var utils = require('utils');

var actionTransferEnergy = {
  /**
   * @param {Creep} creep
   * @param {function} filter
   * @return {bool}
   **/
  transfer: function(creep, filter) {
    var structures = creep.room.structuresNeedingEnergy();
    if (filter) {
      structures = _.filter(structures, filter);
    }
    if (structures != '') {
      var s = creep.pos.findClosestByPath(structures);
      if (creep.transfer(s, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(s, {visualizePathStyle: {}});
      }
      return true;
    }
    return false;
  }
};

module.exports = actionTransferEnergy;
