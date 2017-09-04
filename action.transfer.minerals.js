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
    resource = _.findKey(creep.carry, count => { return count > 0; });
    if (structures != '') {
      var s = creep.pos.findClosestByPath(structures);
      if (!resource) {
        return false;
      }
      if (creep.transfer(s, resource) == ERR_NOT_IN_RANGE) {
        creep.moveTo(s, {ignoreCreeps: true, visualizePathStyle: {}});
      }
      return true;
    }
    else {
      creep.drop(resource);
    }
    return false;
  }
};

module.exports = actionTransferMinerals;
