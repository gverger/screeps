var eta = require("utils.eta");
var utils = require("utils");
var lock = require("lock");
var roleHauler = {
  updateStatus: function(creep) {
    if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.status = "transfering";
    }
    else if (creep.carry.energy == 0) {
      creep.memory.status = "filling";
    }
  },

  run: function(creep) {
    this.updateStatus(creep);

    if(creep.memory.status == "filling") {
      var dropped = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
      var can_lock = false;
      if (dropped != undefined && dropped != null) {
        var currentLock = creep.memory.lock;
        if (currentLock == dropped.id) {
          can_lock = true;
        }
        else {
          var ttd = eta.timeToDestination(creep, dropped);
          can_lock = dropped.amount > ttd && lock.lock(creep, dropped, Game.time + ttd);
          if (can_lock) {
            lock.remove(currentLock);
          }
        }
      }
      if (can_lock) {
        var pickup = creep.pickup(dropped);
        if (pickup == OK) {
          lock.release(creep, dropped);
        }
        if(pickup == ERR_NOT_IN_RANGE) {
          creep.moveTo(dropped);
        }
      } else {
        var canHarvest = require("action.harvest").harvestAnything(creep, function(s) {
          return s.structureType == STRUCTURE_STORAGE ||
            (s.structureType == STRUCTURE_CONTAINER && utils.isHarvestingContainer(s));
        });

        if (!canHarvest) {

          var harvesters = _.filter(Game.creeps, function(c) {
            return c.memory.role == "harvester" && c.carry.energy > 20
          });

          var h = creep.pos.findClosestByPath(harvesters);
          if (h) {
            if(utils.distance(creep, h) > 1) {
              creep.moveTo(h);
            }
            else {
              var errCode = h.drop(RESOURCE_ENERGY, Math.min(h.carry.energy, creep.carryCapacity));
            }
          } else {
            creep.memory.status = "transfering";
          }
        }
      }
    }
    if (creep.memory.status == "transfering") {
      var transferEnergy = require("action.transfer.energy");
      var transferToExtenstion = transferEnergy.transfer(creep, function(s) {
        return [STRUCTURE_SPAWN, STRUCTURE_EXTENSION].includes(s.structureType)
      });
      if (!transferToExtenstion) {
        transferEnergy.transfer(creep, function(s) {
          return s.structureType == STRUCTURE_CONTAINER && !utils.isHarvestingContainer(s)
        });
      }
    }
  }
};

module.exports = roleHauler;
