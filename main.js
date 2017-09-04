var utils = require('utils');
var defend = require('action.defend');
var build = require('action.build.roads');
var spawn = require('action.spawn');
var cleanMemory = require('action.memory.clean');
var lock = require('lock');
// const profiler = require('screeps-profiler');
var cl = require('cl');

require('prototypes');

// profiler.enable();
module.exports = {
  loop: function() {
    // profiler.wrap(function() {
      PathFinder.use(true);
      cleanMemory.clean();
      _.each(Game.spawns, function(s) {
        spawn.spawn(s);
        const room = s.room;
        // lock.visualDebug(room);
        build.buildRoads(room);
        defend.defend(room);
        room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_LINK } }).forEach(function(s) {
          s.run();
        });
      });
      // spawn.spawn(Game.spawns.Spawn1);
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
    _.each(Game.creeps, c => {
      if (c.blockingCreep()) {
        let creep = c.blockingCreep();
        let role = utils.role(creep.memory.role);
        if (!creep.isMoving() && (!role.canGo || role.canGo(creep, c.pos))) {
          creep.moveTo(c.pos);
          creep.say('O');
        } else {
          c.block();
        }
      }
    });
      _.each(Game.flags, f => { f.run(); });
    // });
  }
};
