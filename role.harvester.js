var roleHarvester = {
  updateStatus: function(creep) {
    if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.status = "transfering";
    }
    else if (creep.carry.energy == 0) {
      creep.memory.status = "filling";
    }
  },

  run: function(creep) {
    this.updateStatus(creep);
    if(creep.memory.status == "filling") {
      require("action.harvest").harvest(creep);
    }
    else {
      require("action.transfer.energy").transfer(creep);
    }
  }
};

module.exports = roleHarvester;
