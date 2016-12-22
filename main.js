var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleCarryier = require('role.carryier');

module.exports.loop = function () {
  require("action.memory.clean").clean();
  require("action.spawn").spawn(Game.spawns.Spawn1);
  require("action.build.roads").buildRoads(Game.spawns.Spawn1.room);
  for(var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.spawning) {
      continue;
    }
    if (creep.memory.role == "harvester") {
      roleHarvester.run(creep);
    }
    else if (creep.memory.role == "upgrader" ) {
      roleUpgrader.run(creep);
    }
    else if (creep.memory.role == "builder" ) {
      roleBuilder.run(creep);
    }
    else if (creep.memory.role == "repairer" ) {
      roleRepairer.run(creep);
    }
    else if (creep.memory.role == "carryier" ) {
      roleCarryier.run(creep);
    }
    // creep.say("mon chéri, brossage de dents");
  }
}
