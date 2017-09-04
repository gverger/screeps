var transferEnergy = require('action.transfer.energy');
var roleBuilder = {
  updateStatus: function(creep) {
    if (creep.carry.energy == creep.carryCapacity && creep.memory.status != 'building') {
      creep.memory.status = 'building';
      require('lock').releaseCreep(creep);
    } else if (creep.carry.energy == 0 && creep.memory.status != 'filling') {
      creep.memory.status = 'filling';
      require('lock').releaseCreep(creep);
    }
  },

  run: function(creep) {
    this.updateStatus(creep);

    if (creep.memory.status == 'filling') {
      var harvestAction = require('action.harvest');
      var canHarvest = harvestAction.harvestAnything(creep);
      if (!canHarvest && creep.room.controller.level < 4) {
        harvestAction.harvest(creep);
        return;
      }
    } else if (creep.memory.status == 'building') {
      var site = _.reduce(creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
        filter: (s) => s.structureType !== STRUCTURE_ROAD &&
          (s.pos.x !== creep.pos.x || s.pos.y !== creep.pos.y)
      }), function(best, s) {
        if (s.progressTotal - s.progress < best.progressTotal - best.progress) {
          return s;
        }
        return best;
      });
      if (!site) {
        site = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
        if (!site) {
          var toRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function(object) {
              return (object.hits < Math.min(object.hitsMax, 20000) / 2);
            }
          });
          if (!toRepair) {
            creep.moveTo(creep.room.spawn());
          }
          if (creep.repair(toRepair) == ERR_NOT_IN_RANGE) {
            creep.moveTo(toRepair, {visualizePathStyle: {}});
          }
          return;
        }
      }
      var errCode = creep.build(site);
      if (errCode != OK && errCode != ERR_NOT_IN_RANGE) {
        creep.say(errCode);
      }
      if (errCode == ERR_NOT_IN_RANGE) {
        creep.moveTo(site, {visualizePathStyle: {}});
      }
    }
  }
};

module.exports = roleBuilder;
