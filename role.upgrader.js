var roleUpgrader = {
  updateStatus: function(creep) {
    if (creep.carry.energy == creep.carryCapacity && creep.memory.status != 'upgrading') {
      creep.memory.status = 'upgrading';
      require('lock').releaseCreep(creep);
    } else if (creep.carry.energy == 0 && creep.memory.status != 'filling') {
      creep.memory.status = 'filling';
      require('lock').releaseCreep(creep);
    }
  },

  run: function(creep) {
    this.updateStatus(creep);

    if (this.repairContainer(creep)) {
      return;
    }
    if (creep.memory.status == 'filling') {
      require('action.harvest').harvestAnything(creep);
    } else if (creep.memory.status == 'upgrading') {
      let room = Game.rooms[creep.memory.roomName];
      var controller = room.controller;
      if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, {visualizePathStyle: {}});
      }
    }
  },

  repairContainer: function(creep) {
    if (creep.carry.energy > 0) {
      let containers = creep.pos.findInRange(FIND_STRUCTURES, 1, {
        filter: { structureType: STRUCTURE_CONTAINER }
      });

      let container = _.filter(containers, function(c) { return c.hitsMax / c.hits > 2; })[0];
      if (container) {
        creep.repair(container);
        return true;
      }
    }
    return false;
  }
};

module.exports = roleUpgrader;
