var roleHarvester = {
  updateStatus: function(creep) {
    let workParts = _.filter(creep.body, { type: WORK }).length;
    if (creep.carry.energy + 2 * workParts > creep.carryCapacity) {
      creep.memory.status = 'transfering';
    } else if (creep.carry.energy == 0) {
      creep.memory.status = 'filling';
    }
  },

  run: function(creep) {
    this.updateStatus(creep);
    if (this.repairContainer(creep)) {
      return;
    }
    if (creep.memory.status == 'transfering') {
      require('action.transfer.energy').transfer(creep);
    }
    if (creep.memory.status == 'filling') {
      let harvested = require('action.harvest').harvest(creep);
      if (harvested) {
        require('action.transfer.energy').transfer(creep);
        creep.cancelOrder('move');
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

module.exports = roleHarvester;
