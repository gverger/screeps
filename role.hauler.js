var eta = require('utils.eta');
var utils = require('utils');
var lock = require('lock');
var transferEnergy = require('action.transfer.energy');
var actionHarvest = require('action.harvest');
var transferMinerals = require('action.transfer.minerals');

var roleHauler = {
  carriedWeight: function(creep) {
    return _.sum(creep.carry);
  },

  /**
   * @param {Creep} creep
   **/
  updateStatus: function(creep) {
    if (creep.memory.status !== 'transfering' && this.carriedWeight(creep) == creep.carryCapacity) {
      lock.releaseCreep(creep);
      creep.memory.status = 'transfering';
    } else if (creep.memory.status !== 'filling' && this.carriedWeight(creep) == 0) {
      creep.memory.status = 'filling';
    }
  },

  run: function(creep) {
    this.updateStatus(creep);

    if (creep.memory.status == 'filling') {
      var dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
      var canLock = false;
      if (dropped) {
        var currentLock = creep.memory.lock;
        if (currentLock == dropped.id) {
          canLock = true;
        } else {
          var ttd = creep.timeToDestination(dropped);
          canLock = dropped.amount > ttd && lock.lock(creep, dropped, Game.time + ttd);
          if (canLock) {
            lock.remove(currentLock);
          }
        }
      }
      if (canLock) {
        var pickup = creep.pickup(dropped);
        if (pickup == OK) {
          lock.release(creep, dropped);
        }
        if (pickup == ERR_NOT_IN_RANGE) {
          creep.moveTo(dropped, {visualizePathStyle: {}});
        }
      } else {
        var canHarvest = actionHarvest.harvestAnything(creep);
        if (!canHarvest) {
          var harvesters = creep.nativeRoom.creeps().filter(function(c) {
            if (c.spawning || c.memory.role !== 'harvester') {
              return false;
            }
            let haulers = c.pos.findInRange(FIND_MY_CREEPS, 1, {
              filter: function(hauler) {
                return hauler.memory.role == 'hauler' && hauler.id !== creep.id;
              }
            });
            return haulers.length == 0;
          });

          var harvestersWithoutAContainer = harvesters.filter(function(c) {
            let containers = c.pos.findInRange(FIND_STRUCTURES, 1, {
              filter: {
                function(s) {
                  return s.structureType == STRUCTURE_CONTAINER ||
                    s.structureType == STRUCTURE_LINK;
                }
              }
            });
            return containers.length == 0;
          });

          let harvester = null;
          if (harvestersWithoutAContainer.size() > 0) {
            harvester = creep.pos.findClosestByPath(harvestersWithoutAContainer.value());
          } else {
            harvester = creep.pos.findClosestByPath(harvesters.value());
          }
          if (harvester) {
            if (utils.distance(creep, harvester) > 1) {
              creep.moveTo(harvester, {visualizePathStyle: {}});
            } else {
              let availableCapacity = creep.carryCapacity - this.carriedWeight(creep);
              if (harvestersWithoutAContainer.size() > 0 &&
                  (harvester.carry.energy > harvester.carryCapacity * 0.8
                    || harvester.carry.energy >= availableCapacity)
                  ) {
                var errCode = harvester.drop(RESOURCE_ENERGY,
                    Math.min(harvester.carry.energy, availableCapacity));
              }
            }
          } else {
            if (creep.carry.energy > 0) {
              creep.memory.status = 'transfering';
            }
          }
        }
      }
    }
    if (creep.memory.status == 'transfering') {
      if (creep.carry.energy > 0) {
        let filters = [
          function(s) { return [STRUCTURE_SPAWN, STRUCTURE_EXTENSION].includes(s.structureType); },
          function(s) { return s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity; },
          function(s) { return s.structureType == STRUCTURE_CONTAINER && !s.isForHarvest; },
          function(s) { return s.structureType == STRUCTURE_STORAGE && !s.isFull; }
        ];
        return _.some(filters, function(filter) { return transferEnergy.transfer(creep, filter); });
      }
      transferMinerals.transfer(creep);
    }
  }
};

module.exports = roleHauler;
