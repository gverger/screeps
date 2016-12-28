var lock = require("lock");
var actionSpawn = {
  /**
   * @param {Spawn} spawn
   **/
  spawn: function(spawn) {
    var max_harvesters = 4;
    var max_upgraders = 4;
    var max_builders = 0;
    if (spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
      max_builders = 2;
      max_upgraders = 3;
      if (spawn.room.find(FIND_MY_CONSTRUCTION_SITES, {
        filter: (s) => { return s.structureType == STRUCTURE_EXTENSION }
      }).length > 0) {
        max_upgraders = 0;
        max_builders = 4;
      }
    }
    var max_carryiers = 0;
    var max_repairers = 1;

    var costs = {};
    costs[MOVE] = 50;
    costs[WORK] = 100;
    costs[CARRY] = 50;
    costs[ATTACK] = 80;
    costs[RANGED_ATTACK] = 150;
    costs[HEAL] = 250;
    costs[CLAIM] = 600;
    costs[TOUGH] = 10;

    // this.debug_info();

    if (this.nb_of("harvester") < max_harvesters) {
      lock.lockAllResources(spawn);
    }

    var body = [];
    var maxEnergy = spawn.room.energyCapacityAvailable;
    if (this.nb_of("harvester") == 0) {
      maxEnergy = spawn.room.energyAvailable + spawn.energyCapacity - spawn.energy;
    }

    var enegyNeeded = 0;
    while (enegyNeeded <= maxEnergy) {
      for( let bodyPart of [CARRY, WORK, MOVE, MOVE]) {
        enegyNeeded += costs[bodyPart];
        if (enegyNeeded > maxEnergy)
          break;
        body.push(bodyPart);
      }
    }
    if (spawn.canCreateCreep(body) == OK) {
      if (this.nb_of("harvester") < max_harvesters) {
        var creep = spawn.createCreep(body, undefined, { role: "harvester" });
        console.log("New harvester : " + creep.name);
        lock.releaseAllResources(spawn);
      }
      else if (this.nb_of("upgrader") < max_upgraders) {
        var creep = spawn.createCreep(body, undefined, { role: "upgrader" });
        console.log("New upgrader : " + creep.name);
      }
      else if (this.nb_of("builder") < max_builders) {
        var creep = spawn.createCreep(body, undefined, { role: "builder" });
        console.log("New builder : " + creep.name);
      }
      else if (this.nb_of("repairer") < max_repairers) {
        var creep = spawn.createCreep(body, undefined, { role: "repairer" });
        console.log("New repairer : " + creep.name);
      }
      else if (this.nb_of("carryier") < max_carryiers) {
        var creep = spawn.createCreep([CARRY, CARRY, MOVE, MOVE], undefined, { role: "carryier" });
        console.log("New carryier : " + creep.name);
      }
    }
  },

  nb_of: function(roleName) {
    return _(Game.creeps).filter({ memory: { role:roleName} }).size();
  },

  debug_info: function() {
    var roles = ["harvester", "upgrader", "builder", "repairer", "carryier"];
    for (let i = 0; i < roles.length; i++) {
      var roleName = roles[i];
      console.log('Nb of '+ roleName + ' : ' + this.nb_of(roleName));
    };
  }
};

module.exports = actionSpawn;
