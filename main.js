var utils = require('utils');
var defend = require('action.defend');
var build = require('action.build.roads');
var spawn = require('action.spawn');
var cleanMemory = require('action.memory.clean');
var lock = require('lock');
const profiler = require('screeps-profiler');
var cl = require('cl');

require('prototypes');

profiler.enable();
module.exports = {
  loop: function() {
    profiler.wrap(function() {
      PathFinder.use(true);
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
        let cpu = Game.cpu.getUsed();
        utils.role(creep.memory.role).run(creep);
        cpuUsed = Game.cpu.getUsed() - cpu;
        // creep.say(creep.memory.role[0] + " " + cpuUsed);
        if (Game.cpu.getUsed() > 9) {
          // console.log("CPU");
          // return;
        }
      }
      room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_LINK } }).forEach(function(s) {
        s.run();
      });
      _.each(Game.flags, f => { f.run(); });
    });
  }
};
