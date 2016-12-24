var roleRepairer = {
  updateStatus: function(creep) {
    if(!["repairing", "filling"].includes(creep.memory.status))
      creep.memory.status = "repairing";

    if (creep.carry.energy == creep.carryCapacity && creep.memory.status != "repairing") {
      creep.memory.status = "repairing";
      require("lock").releaseCreep(creep);
    }
    else if (creep.carry.energy == 0 && creep.memory.status != "filling") {
      creep.memory.status = "filling";
      require("lock").releaseCreep(creep);
    }
  },

  run: function(creep) {
    this.updateStatus(creep);

    if(creep.memory.status == "filling") {
      require("action.harvest").harvestAnything(creep);
    }
    else if (creep.memory.status == "repairing") {
      var roadToRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: function(object){
          return  (object.hits < Math.min(object.hitsMax, 20000) / 2);
        }
      });
      if(creep.repair(roadToRepair) == ERR_NOT_IN_RANGE) {
        creep.moveTo(roadToRepair);
      }
    }
  }
};

module.exports = roleRepairer;
