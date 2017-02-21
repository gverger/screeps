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
      lock.releaseAllResources(spawn);
      return;
    }

    if (this.lockForRole(nextRole)) {
      lock.lockAllResources(spawn);
    }
    var body = this.bodyFor(spawn.room, nextRole);
    if (spawn.canCreateCreep(body) == OK) {
      var creep = spawn.createCreep(body, undefined, { role: nextRole, roomName: spawn.room.name});
      console.log('New ' + nextRole + ' created.');
      if (!this.lockForRole(nextRole)) {
        lock.releaseAllResources(spawn);
      }
    }
  },

  bodyFor: function(room, role) {
    var maxEnergy = room.energyCapacityAvailable;
    if ((role == 'harvester' && this.nbOf(room, 'harvester') == 0) ||
        (role == 'hauler' && this.nbOf(room, 'harvester') > 0 && this.nbOf(room, 'hauler') == 0 &&
         room.energyAvailable > (BODYPART_COST[CARRY] + BODYPART_COST[MOVE]))) {
      maxEnergy = room.energyAvailable;
    }

    var body = [];
    var bodyParts = [CARRY, WORK, MOVE];
    var energyNeeded = 0;

    if (role == 'hauler') {
      bodyParts = [CARRY, MOVE];
    } else if (role == 'harvester' && utils.harvestedSources(room).length == 2) {
      body = [CARRY, MOVE];
      bodyParts = [WORK, WORK, WORK, WORK, WORK, MOVE];
      maxEnergy = Math.min(maxEnergy,
          this.bodyCost([CARRY, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK]));
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

  bodyCost: function(body) {
    return _.reduce(body, function(sum, part) {
      return sum + BODYPART_COST[part];
    }, 0);
  },

  lockForRole: function(roleName) {
    return roleName == 'harvester' || roleName == 'hauler';
  },

  nbOf: function(room, roleName) {
    return _(Game.creeps).filter({ memory: { role: roleName, roomName: room.name} }).size();
  },

  nbOfNonSpawning: function(room, roleName) {
    return room.find(FIND_MY_CREEPS, {
      filter: function(creep) {
        return !creep.spawning && creep.memory.role === roleName &&
          creep.memory.roomName === room.name;
      }}).length;
  },

  /**
   * @param {StructureSpawn} spawn
   * @return {string}
   **/
  whatNext: function(spawn) {
    var max = {};
    max['harvester'] = 2;
    max['hauler'] = 1;
    max['upgrader'] = 4;
    max['builder'] = 0;
    if (utils.needMoreHarvesters(spawn)) {
      max['harvester'] = this.nbOf(spawn.room, 'harvester') + 1;
    }
    max['hauler'] = Math.floor(this.nbOfNonSpawning(spawn.room, 'harvester') / 2) + 1;
    if (spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
      max['builder'] = 2;
      max['upgrader'] = 2;
      if (spawn.room.find(FIND_MY_CONSTRUCTION_SITES, {
        filter: (s) => { return s.structureType == STRUCTURE_EXTENSION }
      }).length > 0) {
        max['builder'] = 3;
        max['upgrader'] = 0;
      }
    }
    max['repairer'] = 1;

    var nbOfCreeps = _(Game.creeps).
      filter({ memory: {roomName: spawn.room.name } }).
      countBy('memory.role');

    if (!nbOfCreeps.get('harvester')) {
      return 'harvester';
    }

    for (let r of utils.roles()) {
      var count = nbOfCreeps.get(r) || 0;
      if (count < max[r]) {
        return r;
      }
    }
  },

  test: function() {
    let room = Game.rooms.W7N7;
    let nbOfCreeps = _(Game.creeps).filter({ memory: {roomName: room.name } }).countBy('memory.role');
    return nbOfCreeps;
  }
};

module.exports = actionSpawn;
