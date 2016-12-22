var lock = require("lock");
var actionMemoryClean = {
  clean: function() {
    for(var i in Memory.creeps) {
      creep = Game.creeps[i];
      if(!creep) {
        delete Memory.creeps[i];
        lock.clean();
      }
    }
  }
};

module.exports = actionMemoryClean;
