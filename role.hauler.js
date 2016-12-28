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
      }
    }
    else if (creep.memory.status == "transfering") {
      require("action.transfer.energy").transfer(creep);
    }
  }
};

module.exports = roleHauler;
