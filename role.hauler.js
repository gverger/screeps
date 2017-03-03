var eta = require('utils.eta');
var utils = require('utils');
var lock = require('lock');
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
    } else if (creep.memory.status !== 'filling' && creep.carry.energy == 0) {
      creep.memory.status = 'filling';
    }
  },

  run: function(creep) {
    this.updateStatus(creep);

    if (creep.memory.status == 'filling') {
      var dropped = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
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
        var canHarvest = require('action.harvest').harvestAnything(creep, function(s) {
          return (
              s.structureType == STRUCTURE_CONTAINER &&
              s.isForHarvest &&
              s.store[RESOURCE_ENERGY] > s.storeCapacity / 3
              );
        });
        if (!canHarvest) {
          var harvesters = _.filter(Game.creeps, function(c) {
            if (c.spawning || c.memory.role !== 'harvester') {
              return false;
            }
            let haulers = c.pos.findInRange(FIND_MY_CREEPS, 1, {
              filter: function(h) {
                return h.memory.role == 'hauler' && h.id !== creep.id;
              }
            });
            return haulers.length == 0;
          });

          var harvestersWithoutAContainer = _.filter(harvesters, function(c) {
            let containers = c.pos.findInRange(FIND_STRUCTURES, 1, {
              filter: { structureType: STRUCTURE_CONTAINER }
            });
            return containers.length == 0;
          });

          let h = null;
          if (harvestersWithoutAContainer.length > 0) {
            h = creep.pos.findClosestByPath(harvestersWithoutAContainer);
          } else {
            h = creep.pos.findClosestByPath(harvesters);
          }
          if (h) {
            if (utils.distance(creep, h) > 1) {
              creep.moveTo(h, {visualizePathStyle: {}});
            } else {
              if (harvestersWithoutAContainer.length > 0 &&
                  h.carry.energy > h.carryCapacity * 0.8) {
                var errCode = h.drop(RESOURCE_ENERGY,
                    Math.min(h.carry.energy, creep.carryCapacity - this.carriedWeight(creep)));
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
      var transferEnergy = require('action.transfer.energy');
      var transferToExtension = transferEnergy.transfer(creep, function(s) {
        return [STRUCTURE_SPAWN, STRUCTURE_EXTENSION].includes(s.structureType);
      });
      if (!transferToExtension) {
        transferEnergy.transfer(creep, function(s) {
          return s.structureType == STRUCTURE_CONTAINER && !s.isForHarvest ||
            s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity;
        });
      }
    }
  }
};

module.exports = roleHauler;
