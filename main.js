var utils = require("utils");

module.exports = {
  loop:  function () {
    var room = Game.spawns['Spawn1'].room;
    require("action.memory.clean").clean();
    require("action.spawn").spawn(Game.spawns.Spawn1);
    require("action.build.roads").buildRoads(room);
    require("action.defend").defend(room);
    for(var name in Game.creeps) {
      var creep = Game.creeps[name];
      if (creep.spawning) {
        continue;
      }
      this.runRole(utils.role(creep.memory.role), creep);
    }
  },

  runRole: function(role, creep) {
    var t1 = Game.cpu.getUsed();
    role.run(creep);
    var t2 = Game.cpu.getUsed();
    if (t2 - t1 > 3) {
      console.log(creep.name + ", " + creep.memory.role[0] + " " + creep.memory.status + " : " + (t2 - t1));
    }
  }
}
