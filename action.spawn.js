var utils = require("utils");
var lock = require("lock");
var actionSpawn = {
  /**
   * @param {Spawn} spawn
   **/
  spawn: function(spawn) {
    // this.debug_info();
    var nextRole = this.whatNext(spawn);
    if (!nextRole)
      return;

    if (nextRole == "harvester") {
      lock.lockAllResources(spawn);
    }
    var body = this.bodyFor(spawn, nextRole);
    if (spawn.canCreateCreep(body) == OK) {
      var creep = spawn.createCreep(body, undefined, { role: nextRole});
      console.log("New " + nextRole + " created.");
      if (nextRole == "harvester") {
        lock.releaseAllResources(spawn);
      }
    }
  },

  bodyFor: function(spawn, role) {
    var maxEnergy = spawn.room.energyCapacityAvailable;
    if (role == "harvester" && this.nbOf("harvester") == 0) {
      maxEnergy = spawn.room.energyAvailable;
    }

    var bodyParts = [CARRY, WORK, MOVE];
    if (role == "hauler")
      bodyParts = [CARRY, MOVE];
    var body = [];
    var enegyNeeded = 0;
    while (enegyNeeded <= maxEnergy) {
      for( let bodyPart of bodyParts) {
        enegyNeeded += BODYPART_COST[bodyPart];
        if (enegyNeeded > maxEnergy)
          break;
        body.push(bodyPart);
      }
    }
    return body;
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
    max['harvester'] = 3;
    max['upgrader'] = 4;
    max['builder'] = 0;
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
    max['hauler'] = 2;
    max['repairer'] = 1;

    var nbOfCreeps = _.countBy(_.filter(Game.creeps, { room: spawn.room }), 'memory.role');

    for(let r of utils.roles()) {
      var count = nbOfCreeps[r] || 0;
      if (count < max[r])
        return r;
    }
  },

  debug_info: function() {
    for (let roleName of utils.roles()) {
      console.log('Nb of '+ roleName + ' : ' + this.nbOf(roleName));
    };
  }
};

module.exports = actionSpawn;
