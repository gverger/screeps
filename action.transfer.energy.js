var actionTransferEnergy = {
  transfer: function(creep) {
    var structures = creep.room.find(FIND_STRUCTURES, {
      filter: (s) => {
        var structureTypes = [STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_EXTENSION];
        return (structureTypes.includes(s.structureType)) && s.energy < s.energyCapacity;
      }
    });
    if (structures != "") {
      var s = creep.pos.findClosestByPath(structures);
      if(creep.transfer(s, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(s);
      }
    }
    else {
      var structures = creep.room.find(FIND_STRUCTURES, {
        filter: (s) => {
          var structureTypes = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE];
          return structureTypes.includes(s.structureType) && s.store[RESOURCE_ENERGY] < s.storeCapacity;
        }
      });
      if (structures != "") {
        var s = creep.pos.findClosestByPath(structures);
        if(creep.transfer(s, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(s);
        }
      }

    }
  }
};

module.exports = actionTransferEnergy;
