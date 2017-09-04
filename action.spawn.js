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
      console.log(spawn.name + ': New ' + nextRole + ' created.');
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
    var suffix = [];
    var energyNeeded = 0;

    if (role == 'hauler' || role == 'stealer') {
      bodyParts = [CARRY, MOVE];
    } else if (role == 'harvester' && room.harvestedSources().length == room.sources().size()) {
      body = [CARRY, MOVE];
      bodyParts = [WORK, WORK, WORK, WORK, WORK, MOVE];
      maxEnergy = Math.min(maxEnergy,
          this.bodyCost([CARRY, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK]));
      energyNeeded = this.bodyCost(body);
    // } else if (role == 'remote-miner') {
    //   bodyParts = [CARRY, MOVE, CARRY, MOVE, WORK];
    } else if (role == 'claimer') {
      body = [MOVE, MOVE, CLAIM];
      energyNeeded = this.bodyCost(body);
    }
    else if (role == 'attacker') {
      body = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH];
      bodyParts = [RANGED_ATTACK, MOVE, MOVE];
      suffix = [MOVE, HEAL];
      energyNeeded = this.bodyCost(body);
      maxEnergy = maxEnergy - this.bodyCost(suffix);
    }
    else if (role == 'source-blocker') {
      body = [MOVE];
      energyNeeded = this.bodyCost(body);
      maxEnergy = energyNeeded;
    }
    if (energyNeeded > room.energyCapacityAvailable) {
      console.log(spawn.name + " CANNOT BUILD " + role);
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
    suffix.forEach(part => { body.push(part); });
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
    return room.creeps().filter({ memory: { role: roleName} }).size();
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
    let flags = _(Game.flags);
    max['harvester'] = 2;
    max['hauler'] = 1;
    max['attacker'] = flags.filter(f => { return f.needCreep('attacker', spawn); }).size();
    max['stealer'] = flags.filter(f => { return f.needCreep('stealer', spawn); }).size();
    max['source-blocker'] = flags.filter(f => { return f.needCreep('source-blocker', spawn); }).size();
    max['remote-miner'] = flags.filter(f => { return f.needCreep('remote-miner', spawn); }).size();
    max['upgrader'] = timeToUpgradeController ? (spawn.room.controller.level < 4 ? 4 : 3) : 1;
    max['claimer'] = _.size(_.filter(Game.flags, { memory: { role: 'claimer' } }));
    max['builder'] = 0;
    if (spawn.room.needMoreHarvesters()) {
      max['harvester'] = this.nbOf(spawn.room, 'harvester') + 1;
    }
    max['hauler'] = Math.ceil(this.nbOfNonSpawning(spawn.room, 'harvester') / 2) + (timeToUpgradeController ? 1 : 0);
    if (spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
      max['builder'] = 1;
      if (spawn.room.find(FIND_MY_CONSTRUCTION_SITES, {
        filter: (s) => { return s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_LINK }
      }).length > 0) {
        max['builder'] = spawn.room.controller.level < 4 ? 4 : 3;
      }
    }
    max['repairer'] = 0;

    var nbOfCreeps = _(spawn.room.creeps()).countBy('memory.role');

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
  }
};

module.exports = actionSpawn;
