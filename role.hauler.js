var utils = require("utils");
var roleHauler = {
  updateStatus: function(creep) {
    if (creep.room.find(FIND_DROPPED_ENERGY) == "" && creep.carry.energy > 0) {
      creep.memory.status = "transfering";
    }
    else if (creep.carry.energy == 0) {
      creep.memory.status = "filling";
    }
  },

  run: function(creep) {
    this.updateStatus(creep);

    if(creep.memory.status == "filling") {
      dropped = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
      if (dropped != null) {
        if(creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
          creep.moveTo(dropped);
        }
      } else {
        require("action.harvest").harvestAnything(creep, function(s) {
          return s.structureType == STRUCTURE_STORAGE ||
            (s.structureType == STRUCTURE_CONTAINER && utils.isHarvestingContainer(s));
        });
      }
    }
    else if (creep.memory.status == "transfering") {
      require("action.transfer.energy").transfer(creep, function(s) {
        return [STRUCTURE_SPAWN, STRUCTURE_EXTENSION].includes(s.structureType) ||
          s.structureType == STRUCTURE_CONTAINER && !utils.isHarvestingContainer(s)
      });
    }
  }
};

module.exports = roleHauler;
