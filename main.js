var utils = require('utils');
require('prototypes')();

module.exports = {
  loop: function() {
    var room = Game.spawns['Spawn1'].room;
    require('lock').visualDebug(room);
    require('action.memory.clean').clean();
    require('action.spawn').spawn(Game.spawns.Spawn1);
    require('action.build.roads').buildRoads(room);
    require('action.defend').defend(room);
    for (let name in Game.creeps) {
      var creep = Game.creeps[name];
      if (creep.spawning) {
        continue;
      }
      utils.role(creep.memory.role).run(creep);
    }
  }
};
