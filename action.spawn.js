var utils = require('utils');
var lock = require('lock');
var actionSpawn = {
  /**
   * @param {Spawn} spawn
   **/
  spawn: function(spawn) {
    // this.debug_info();
    var nextRole = this.whatNext(spawn);
    if (!nextRole) {
      return;
    }

    if (this.lockForRole(nextRole)) {
      lock.lockAllResources(spawn);
    }
    var body = this.bodyFor(spawn, nextRole);
    if (spawn.canCreateCreep(body) == OK) {
      var creep = spawn.createCreep(body, undefined, { role: nextRole});
      console.log('New ' + nextRole + ' created.');
      if (this.lockForRole(nextRole)) {
        lock.releaseAllResources(spawn);
      }
    }
  },

  bodyFor: function(spawn, role) {
    var maxEnergy = spawn.room.energyCapacityAvailable;
    if ((role == 'harvester' && this.nbOf('harvester') == 0) ||
        (role == 'hauler' && this.nbOf('harvester') > 0 && this.nbOf('hauler') == 0 &&
         spawn.room.energyAvailable > (BODYPART_COST[CARRY] + BODYPART_COST[MOVE]))) {
      maxEnergy = spawn.room.energyAvailable;
    }

    var body = [];
    var bodyParts = [CARRY, WORK, MOVE];
    var energyNeeded = 0;

    if (role == 'hauler') {
      bodyParts = [CARRY, MOVE];
    } else if (role == 'harvester' && utils.harvestedSources(spawn.room).length == 2) {
      body = [CARRY, MOVE];
      bodyParts = [WORK, WORK, WORK, WORK, WORK, MOVE];
      maxEnergy = Math.min(maxEnergy, BODYPART_COST[CARRY] + 2*BODYPART_COST[MOVE] + 5*BODYPART_COST[WORK]);
      energyNeeded = BODYPART_COST[CARRY] + BODYPART_COST[MOVE];
    }
    while (energyNeeded <= maxEnergy && body.length < 50) {
      for (let bodyPart of bodyParts) {
        energyNeeded += BODYPART_COST[bodyPart];
        if (energyNeeded > maxEnergy || body.length >= 50) {
          break;
        }
        body.push(bodyPart);
      }
    }
    return body;
  },

  lockForRole: function(roleName) {
    return roleName == "harvester" || roleName == "hauler";
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
    max['harvester'] = 2;
    max['hauler'] = 1;
    max['upgrader'] = 2;
    max['builder'] = 0;
    if (spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
      max['builder'] = 1;
      max['upgrader'] = 1;
      if (spawn.room.find(FIND_MY_CONSTRUCTION_SITES, {
        filter: (s) => { return s.structureType == STRUCTURE_EXTENSION }
      }).length > 0) {
        max['builder'] = 2;
        max['upgrader'] = 0;
      }
    }
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
