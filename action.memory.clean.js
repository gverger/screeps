var lock = require("lock");
var actionMemoryClean = {
  clean: function() {
    for(var i in Memory.creeps) {
      creep = Game.creeps[i];
      if(!creep || creep.ticksToLive <= 10) {
        locked = Memory.creeps[i].lock
        delete Memory.creeps[i];
        if (creep) {
          lock.releaseCreep(creep);
          console.log("Release " + creep.name);
          creep.suicide();
        }
      }
    }
  }
};

module.exports = actionMemoryClean;
