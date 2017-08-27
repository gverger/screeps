var actionTransferMinerals = {
  /**
   * @param {Creep} creep
   * @param {function} filter
   * @return {bool}
   **/
  transfer: function(creep, filter) {
    let structures = creep.room.find(FIND_STRUCTURES, { filter: (s) => {
      return s.structureType == STRUCTURE_STORAGE && !s.isFull;
    }});
    if (filter) {
      structures = _.filter(structures, filter);
    }
    if (structures != '') {
      var s = creep.pos.findClosestByPath(structures);
      resource = _.findKey(creep.carry, count => { return count > 0; });
      if (!resource) {
        return false;
      }
      if (creep.transfer(s, resource) == ERR_NOT_IN_RANGE) {
        creep.moveTo(s, {visualizePathStyle: {}});
      }
      return true;
    }
    return false;
  }
};

module.exports = actionTransferMinerals;
