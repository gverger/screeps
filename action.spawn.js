var actionSpawn = {
  spawn: function(spawn) {
    var max_harvesters = 8;
    var max_upgraders = 10;
    var max_builders = 8;
    var max_carryiers = 1;

    // this.debug_info();

    var body = [CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE];
    if (spawn.canCreateCreep(body) == OK) {
      if (this.nb_of("harvester") < max_harvesters) {
        creep = spawn.createCreep(body, undefined, { role: "harvester" });
        console.log("New harvester : " + creep.name);
      }
      else if (this.nb_of("upgrader") < max_upgraders) {
        creep = spawn.createCreep(body, undefined, { role: "upgrader" });
        console.log("New upgrader : " + creep.name);
      }
      else if (this.nb_of("builder") < max_builders) {
        creep = spawn.createCreep(body, undefined, { role: "builder" });
        console.log("New builder : " + creep.name);
      }
      else if (this.nb_of("carryier") < max_carryiers) {
        creep = spawn.createCreep([CARRY, CARRY, MOVE, MOVE], undefined, { role: "carryier" });
        console.log("New carryier : " + creep.name);
      }
    }
  },

  nb_of: function(roleName) {
    return _(Game.creeps).filter({ memory: { role:roleName} }).size();
  },

  debug_info: function() {
    var roles = ["harvester", "upgrader", "builder", "carryier"];
    for (let i = 0; i < roles.length; i++) {
      roleName = roles[i];
      console.log('Nb of '+ roleName + ' : ' + this.nb_of(roleName));
    };
  }
};

module.exports = actionSpawn;
