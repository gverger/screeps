var roleBuilder = {
  updateStatus: function(creep) {
    if (creep.carry.energy == creep.carryCapacity && creep.memory.status != "building") {
      creep.memory.status = "building";
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
    else if (creep.memory.status == "building") {
      var site = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {
        filter: (s) => { return s.structureType != STRUCTURE_ROAD }
      });
      if (!site) {
        site = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
      }
      if(creep.build(site) == ERR_NOT_IN_RANGE) {
        creep.moveTo(site);
      }
    }
  }
};

module.exports = roleBuilder;
