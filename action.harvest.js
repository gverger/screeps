var utils = require("utils");
var eta = require("utils.eta");
var lock = require("lock");

var actionHarvest = {
  harvest: function(creep) {
    var source = this.lockedResource(creep);
    if (source) {
      if (source.energy == 0) {
        lock.release(creep, source);
        source = null;
      }
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
        return false;
      }
      return true;
    }
    let sources = creep.room.find(FIND_SOURCES_ACTIVE);
    let lockedSource = this.lockClosest(creep, sources);
    if (lockedSource) {
      if (creep.harvest(lockedSource) == ERR_NOT_IN_RANGE) {
        creep.moveTo(lockedSource);
        return false;
      }
      return true;
    }
    return false;
  },

  harvestAnything: function(creep, filter) {
    var s = this.lockedResource(creep);
    if (s != undefined) {
      if ((s.energyCapacity && s.energy == 0) ||
          ([STRUCTURE_STORAGE, STRUCTURE_CONTAINER].includes(s.structureType) && s.store[RESOURCE_ENERGY] == 0) ||
          (s.amount == 0)) {
        lock.release(creep, s);
      } else {
        this.goHarvest(creep, s);
        return true;
      }
    }
    var structures = utils.structuresGivingEnergy(creep.room);
    if (filter) {
      structures = _.filter(structures, filter);
    }
    if (structures != '') {
      let lockedStructure = this.lockClosest(creep, structures);
      if (lockedStructure) {
        this.goHarvest(creep, lockedStructure);
        return true;
      }
    }
    return false;
  },

  sortByDistance: function(creep, objects) {
    let distances = {};
    for (i = 0; i < objects.length; i++) {
      let s = objects[i];
      distances[s] = creep.pos.findPathTo(s).length;
    }
    return objects.sort((s1, s2) => { return distances[s1] - distances[s2]; });
  },

  lockClosest: function(creep, resources) {
    resources = this.sortByDistance(creep, resources);
    var idx = 0;
    var canLock = false;
    while (idx < resources.length && !canLock) {
      var s = resources[idx];
      let canLock = lock.lock(creep, s, Game.time + eta.timeToDestination(creep, s));
      if (canLock) {
        return s;
      }
      idx ++;
    }
    return null;
  },

  goHarvest: function(creep, structure) {
    var errCode = creep.withdraw(structure, RESOURCE_ENERGY );
    if (structure.amount) {
      errCode = creep.pickup(structure);
    }
    if (errCode == OK) {
      lock.releaseCreep(creep);
    }
    if(errCode == ERR_NOT_IN_RANGE) {
      creep.moveTo(structure);
    }
    if (errCode != OK && errCode != ERR_NOT_IN_RANGE)
      creep.say(errCode);
  },

  lockedResource: function(creep) {
    if (creep.memory.lock == undefined)
      return undefined;
    var resource = Game.getObjectById(creep.memory.lock);
    if (!resource) {
      lock.remove(creep.memory.lock);
      delete creep.memory.lock
    }
    return resource;
  }
};

module.exports = actionHarvest;
