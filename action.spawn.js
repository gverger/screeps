var lock = require("lock");
var actionSpawn = {
  /**
   * @param {Spawn} spawn
   **/
  spawn: function(spawn) {
    // this.debug_info();
    var next_role = this.whatNext(spawn);
    if (!next_role)
      return;

    if (next_role == "harvester") {
      lock.lockAllResources(spawn);
    }

    var body = [];
    var maxEnergy = spawn.room.energyCapacityAvailable;
    if (this.nbOf("harvester") == 0) {
      maxEnergy = spawn.room.energyAvailable + spawn.energyCapacity - spawn.energy;
    }

    var enegyNeeded = 0;
    while (enegyNeeded <= maxEnergy) {
      for( let bodyPart of [CARRY, WORK, MOVE, MOVE]) {
        enegyNeeded += BODYPART_COST[bodyPart];
        if (enegyNeeded > maxEnergy)
          break;
        body.push(bodyPart);
      }
    }
    if (spawn.canCreateCreep(body) == OK) {
      var creep = spawn.createCreep(body, undefined, { role: next_role});
      console.log("New " + next_role + " created.");
      if (next_role == "harvester") {
        lock.releaseAllResources(spawn);
      }
    }
  },

  nbOf: function(roleName) {
    return _(Game.creeps).filter({ memory: { role:roleName} }).size();
  },

  /**
   * @param {StructureSpawn} spawn
   * @return {string}
   **/
  whatNext: function(spawn) {
    var max = {};
    max['harvester'] = 4;
    max['upgrader'] = 4;
    max['builder'] = 4;
    if (spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
      max['builder'] = 2;
      max['upgrader'] = 3;
      if (spawn.room.find(FIND_MY_CONSTRUCTION_SITES, {
        filter: (s) => { return s.structureType == STRUCTURE_EXTENSION }
      }).length > 0) {
        max['builder'] = 4;
        max['upgrader'] = 0;
      }
    }
    max['carryier'] = 0;
    max['repairer'] = 1;

    var nbOfCreeps = _.countBy(spawn.room.find(FIND_MY_CREEPS), 'memory.role');
    for(let r of this.roles()) {
      var count = nbOfCreeps[r] || 0;
      if (count < max[r])
        return r;
    }
  },

  debug_info: function() {
    for (let roleName of this.roles()) {
      console.log('Nb of '+ roleName + ' : ' + this.nbOf(roleName));
    };
  },

  roles: function() {
    if (!this.cachedRoles) {
      this.cachedRoles = ["harvester", "upgrader", "builder", "repairer", "carryier"];
    }
    return this.cachedRoles;
  }
};

module.exports = actionSpawn;
