var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleCarryier = require('role.carryier');

module.exports = {
  loop:  function () {
    require("action.memory.clean").clean();
    require("action.spawn").spawn(Game.spawns.Spawn1);
    require("action.build.roads").buildRoads(Game.spawns.Spawn1.room);
    for(var name in Game.creeps) {
      var creep = Game.creeps[name];
      if (creep.spawning) {
        continue;
      }
      if (creep.memory.role == "harvester") {
        this.runRole(roleHarvester, creep);
      }
      else if (creep.memory.role == "upgrader" ) {
        this.runRole(roleUpgrader, creep);
      }
      else if (creep.memory.role == "builder" ) {
        this.runRole(roleBuilder, creep);
      }
      else if (creep.memory.role == "repairer" ) {
        this.runRole(roleRepairer, creep);
      }
      else if (creep.memory.role == "carryier" ) {
        this.runRole(roleCarryier, creep);
      }
    }
  },

  runRole: function(role, creep) {
    t1 = Game.cpu.getUsed();
    role.run(creep);
    t2 = Game.cpu.getUsed();
    if (t2 - t1 > 3) {
      console.log(creep.name + ", " + creep.memory.role[0] + " " + creep.memory.status + " : " + (t2 - t1));
    }
  }
}
