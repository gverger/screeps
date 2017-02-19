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
  }
};

module.exports = actionMemoryClean;
