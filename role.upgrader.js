var roleUpgrader = {
  updateStatus: function(creep) {
    if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.status = "upgrading";
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
    else if (creep.memory.status == "upgrading") {
      controller = creep.room.controller
      if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(controller);
      }
    }
  }
};

module.exports = roleUpgrader;
