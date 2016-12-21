var roleBuilder = {
  updateStatus: function(creep) {
    if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.status = "building";
    }
    else if (creep.carry.energy == 0) {
      creep.memory.status = "filling";
    }
  },

  run: function(creep) {
    this.updateStatus(creep);

    if(creep.memory.status == "filling") {
      require("action.harvest").harvestAnything(creep);
    }
    else if (creep.memory.status == "building") {
      site = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
      if(creep.build(site) == ERR_NOT_IN_RANGE) {
        creep.moveTo(site);
      }
    }
  }
};

module.exports = roleBuilder;
