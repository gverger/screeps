var lock = require("lock");

var actionHarvest = {
  harvest: function(creep) {
    source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  },

  harvestAnything: function(creep) {
    s = this.locked_resource(creep);
    if (s != undefined) {
      if (s.energy == 0) {
        lock.release(creep, s);
      }
      else {
        this.goHarvest(creep, s);
        return;
      }
    }
    structures = creep.room.find(FIND_STRUCTURES, {
      filter: (s) => {
        structureTypes = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN];
        return (s.structureType === STRUCTURE_EXTENSION && s.energy > 0) ||
          (s.structureType === STRUCTURE_SPAWN && s.energy > 100) ||
          (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0);
      }
    });
    if (structures != "") {
      var distances = {}
      for (i= 0; i < structures.length; i++) {
        s = structures[i];
        distances[s] = creep.pos.findPathTo(s).length;
      }
      structures = structures.sort((s1, s2) => { return distances[s1] - distances[s2] });
      var idx = 0;
      var can_lock = false;
      while (idx < structures.length && !can_lock) {
        s = structures[idx];
        can_lock = lock.lock(creep, s, Game.time + require("utils.eta").timeToDestination(creep, s));
        idx ++;
      }
      if (can_lock)
        this.goHarvest(creep, s);
      else
        this.harvest(creep);
    }
    else {
      this.harvest(creep);
    }
  },

  goHarvest: function(creep, structure) {
    if(creep.withdraw(s, RESOURCE_ENERGY ) == ERR_NOT_IN_RANGE) {
      creep.moveTo(s);
    }
  },

  locked_resource: function(creep) {
    if (creep.memory.lock == undefined)
      return undefined;
    return Game.getObjectById(creep.memory.lock);
  }
};

module.exports = actionHarvest;
