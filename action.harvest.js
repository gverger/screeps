var utils = require("utils");
var eta = require("utils.eta");
var lock = require("lock");

var actionHarvest = {
  harvest: function(creep) {
    var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  },

  harvestAnything: function(creep, filter) {
    var s = this.locked_resource(creep);
    if (s != undefined) {
      if ((s.energyCapacity && s.energy == 0) ||
          ([STRUCTURE_STORAGE, STRUCTURE_CONTAINER].includes(s.structureType) && s.store[RESOURCE_ENERGY] == 0))
          {
        lock.release(creep, s);
      }
      else {
        this.goHarvest(creep, s);
        return true;
      }
    }
    var structures = utils.structuresGivingEnergy(creep.room);
    if (filter)
      structures = _.filter(structures, filter);
    if (structures != "") {
      var distances = {}
      for (i = 0; i < structures.length; i++) {
        var s = structures[i];
        distances[s] = creep.pos.findPathTo(s).length;
      }
      var structures = structures.sort((s1, s2) => { return distances[s1] - distances[s2] });
      var idx = 0;
      var can_lock = false;
      while (idx < structures.length && !can_lock) {
        var s = structures[idx];
        var can_lock = lock.lock(creep, s, Game.time + eta.timeToDestination(creep, s));
        idx ++;
      }
      if (can_lock) {
        this.goHarvest(creep, s);
        return true;
      }
    }
    return false;
  },

  goHarvest: function(creep, structure) {
    var errCode = creep.withdraw(structure, RESOURCE_ENERGY );
    if (errCode == OK) {
      lock.releaseCreep(creep);
    }
    if(errCode == ERR_NOT_IN_RANGE) {
      creep.moveTo(structure);
    }
    if (errCode != OK && errCode != ERR_NOT_IN_RANGE)
      creep.say(errCode);
  },

  locked_resource: function(creep) {
    if (creep.memory.lock == undefined)
      return undefined;
    var resource = Game.getObjectById(creep.memory.lock);
    if (!resource)
      delete creep.memory.lock
    return resource;
  }
};

module.exports = actionHarvest;
