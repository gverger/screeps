var utils = require('utils');
var lock = require('lock');
var actionSpawn = {
  /**
   * @param {Spawn} spawn
   **/
  spawn: function(spawn) {
    // this.debug_info();
    var nextRole = this.whatNext(spawn);
    if (this.lockForRole(nextRole)) {
      lock.lockAllResources(spawn);
    } else {
      lock.releaseAllResources(spawn);
    }
    if (!nextRole) {
      lock.releaseAllResources(spawn);
      return;
    }

    var body = this.bodyFor(spawn.room, nextRole);
    if (spawn.canCreateCreep(body) == OK) {
      var creep = spawn.createCreep(body, undefined, { role: nextRole, roomName: spawn.room.name});
      console.log('New ' + nextRole + ' created.');
    }
  },

  bodyFor: function(room, role) {
    var maxEnergy = room.energyCapacityAvailable;
    if (role == 'harvester' && this.nbOf(room, 'harvester') == 0 &&
        room.energyAvailable > this.bodyCost([CARRY, WORK, MOVE])) {
      maxEnergy = room.energyAvailable;
    }
    if (role == 'harvester') {
      maxEnergy = Math.min(maxEnergy, 5 * this.bodyCost([CARRY, WORK, MOVE]));
    }
    if (role == 'hauler' && this.nbOf(room, 'hauler') == 0 &&
         room.energyAvailable > (BODYPART_COST[CARRY] + BODYPART_COST[MOVE])) {
      maxEnergy = room.energyAvailable;
    }
    if (role == 'claimer') {
      maxEnergy = this.bodyCost([MOVE, MOVE, CLAIM]);
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
      energyNeeded = this.bodyCost(body);
    } else if (role == 'remote-miner') {
      bodyParts = [CARRY, MOVE, CARRY, MOVE, WORK];
    } else if (role == 'claimer') {
      body = [MOVE, MOVE, CLAIM];
      energyNeeded = this.bodyCost(body);
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
    let timeToUpgradeController = spawn.room.timeToUpgradeController();
    var max = {};
    max['harvester'] = 2;
    max['hauler'] = 1;
    max['remote-miner'] = _.size(_.filter(Game.flags, { memory: { role: 'remote-miner' } }));
    max['upgrader'] = timeToUpgradeController ? 2 : 0;
    max['claimer'] = _.size(_.filter(Game.flags, { memory: { role: 'claimer' } }));
    max['builder'] = 0;
    if (utils.needMoreHarvesters(spawn)) {
      max['harvester'] = this.nbOf(spawn.room, 'harvester') + 1;
    }
    max['hauler'] = Math.ceil(this.nbOfNonSpawning(spawn.room, 'harvester') / 2) + (timeToUpgradeController ? 1 : 0);
    if (spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
      max['builder'] = 1;
      max['upgrader'] = 1;
      if (spawn.room.find(FIND_MY_CONSTRUCTION_SITES, {
        filter: (s) => { return s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_LINK }
      }).length > 0) {
        max['builder'] = 4;
        max['upgrader'] = 0;
      }
    }
    max['repairer'] = 0;

    var nbOfCreeps = _(Game.creeps).
      filter({ memory: {roomName: spawn.room.name } }).
      countBy('memory.role');

    if (!nbOfCreeps.get('harvester')) {
      return 'harvester';
    }

    if (!nbOfCreeps.get('hauler')) {
      return 'hauler';
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
