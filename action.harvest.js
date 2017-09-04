var utils = require('utils');
var eta = require('utils.eta');
var lock = require('lock');

var actionHarvest = {
  harvest: function(creep) {
    var source = this.lockedResource(creep);
    if (source) {
      if (source.energy == 0 || !source.hasAssociatedContainer || creep.getActiveBodyparts(WORK) < 5) {
        lock.release(creep, source);
        source = null;
      }
      let canHarvest = creep.harvest(source);
      if (canHarvest == ERR_NOT_IN_RANGE) {
        let canMove = creep.moveTo(source, {visualizePathStyle: {}});
        return canMove == OK;
      }
      return canHarvest == OK;
    }
    let sources = creep.nativeRoom.find(FIND_SOURCES_ACTIVE, {
      filter: function(source) {
        let harvesters =
          source.pos.findInRange(FIND_MY_CREEPS, 1, {
            filter: function(c) {
              return c.memory.role === 'harvester' && c.id != creep.id;
            }});
        let nbWorkParts = _.sum(harvesters, function(c) { return c.getActiveBodyparts(WORK); });
        if (nbWorkParts >= 5) {
          return false;
        }

        if (harvesters.length >= source.nbOfHarvestingSlots()) {
          return false;
        }
        return true;
      }});
    let lockedSource = creep.lockClosest(sources);
    if (lockedSource) {
      if (!lockedSource.hasAssociatedContainer || creep.getActiveBodyparts(WORK) < 5) {
        lock.release(creep, lockedSource);
      }
      if (creep.harvest(lockedSource) == ERR_NOT_IN_RANGE) {
        creep.moveTo(lockedSource, {visualizePathStyle: {}});
        return false;
      }
      return true;
    }
    return false;
  },

  harvestAnything: function(creep, filter) {
    var s = this.lockedResource(creep);
    if (s != undefined) {
      let filteredOut = filter && !filter(s);
      if (!filteredOut && s.hasEnergy) {
        this.goHarvest(creep, s);
        return true;
      }
      lock.release(creep, s);
    }
    // var structures = utils.structuresGivingEnergy(creep.nativeRoom);
    var structures = creep.nativeRoom.structuresToHarvest(creep.memory.role);

    if (filter) {
      structures = _.filter(structures, filter);
    }
    if (structures != '') {
      let lockedStructure = creep.lockClosest(structures);
      if (lockedStructure) {
        this.goHarvest(creep, lockedStructure);
        return true;
      }
    }
    return false;
  },

  goHarvest: function(creep, structure) {
    var errCode = creep.withdraw(structure, RESOURCE_ENERGY);
    if (structure.amount) {
      errCode = creep.pickup(structure);
    }
    if (errCode == OK) {
      lock.releaseCreep(creep);
    }
    if (errCode == ERR_NOT_IN_RANGE) {
      if (creep.memory.role == "hauler") {
        creep.moveTo(structure, {ignoreCreeps: true, visualizePathStyle: {}});
      }
      else {
      creep.moveTo(structure, {visualizePathStyle: {}});
      }
    }
    if (errCode != OK && errCode != ERR_NOT_IN_RANGE) {
      creep.say(errCode);
    }
  },

  lockedResource: function(creep) {
    if (creep.memory.lock == undefined) {
      return undefined;
    }
    var resource = Game.getObjectById(creep.memory.lock);
    if (!resource) {
      lock.remove(creep.memory.lock);
      delete creep.memory.lock;
    }
    return resource;
  }
};

module.exports = actionHarvest;
