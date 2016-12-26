var roleUpgrader = {
  updateStatus: function(creep) {
    if (creep.carry.energy == creep.carryCapacity && creep.memory.status != "upgrading") {
      creep.memory.status = "upgrading";
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
    else if (creep.memory.status == "upgrading") {
      var controller = creep.room.controller
      if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(controller);
      }
    }
  }
};

module.exports = roleUpgrader;
