var actionTransferEnergy = {
  transfer: function(creep) {
    structures = creep.room.find(FIND_STRUCTURES, {
      filter: (s) => {
        structureTypes = [STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_EXTENSION];
        return (structureTypes.includes(s.structureType)) && s.energy < s.energyCapacity;
      }
    });
    if (structures != "") {
      s = creep.pos.findClosestByPath(structures);
      if(creep.transfer(s, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(s);
      }
    }
  }
};

module.exports = actionTransferEnergy;
