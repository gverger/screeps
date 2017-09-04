var lock = require('lock');
var utils = require('utils');
var actionMemoryClean = {
  clean: function() {
    for (var i in Memory.creeps) {
      var creep = Game.creeps[i];
      if (!creep) {
        delete Memory.creeps[i];
        lock.clean();
      }
    }
    utils.clean();
    for(let flag in Memory.flags) {
      if (!Game.flags[flag]) {
        console.log("Flag " + flag + " is no more.");
        let assignedCreepName = Memory.flags[flag].assignedCreepName;
        if (assignedCreepName) {
          let creep = Game.creeps[assignedCreepName];
          if (creep) {
            delete creep.memory.flagName;
          }
        }
        delete Memory.flags[flag];
      }
    }
  }
};

module.exports = actionMemoryClean;
