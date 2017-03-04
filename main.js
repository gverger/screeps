var utils = require('utils');
var defend = require('action.defend');
var build = require('action.build.roads');
var spawn = require('action.spawn');
var cleanMemory = require('action.memory.clean');
var lock = require('lock');
const profiler = require('screeps-profiler');

require('prototypes')();

profiler.enable();
module.exports = {
  loop: function() {
    profiler.wrap(function() {
      var room = Game.spawns.Spawn1.room;
      lock.visualDebug(room);
      cleanMemory.clean();
      spawn.spawn(Game.spawns.Spawn1);
      build.buildRoads(room);
      defend.defend(room);
      for (let name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.spawning) {
          continue;
        }
        utils.role(creep.memory.role).run(creep);
      }
    });
  }
};
