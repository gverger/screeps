var roleHarvester = {
  updateStatus: function(creep) {
    let workParts = _.filter(creep.body, { type: WORK }).length;
    if (creep.memory.status !== 'transfering' &&
      creep.carry.energy + 2 * workParts > creep.carryCapacity) {
      creep.memory.status = 'transfering';
      require('lock').releaseCreep(creep);
    } else if (creep.memory.status !== 'filling' && creep.carry.energy == 0) {
      creep.memory.status = 'filling';
    }
  },

  run: function(creep) {
    this.updateStatus(creep);
    if (creep.memory.status == 'transfering') {
      require('action.transfer.energy').transfer(creep);
    }
    if (creep.memory.status == 'filling') {
      let harvested = require('action.harvest').harvest(creep);
      if (creep.carry.energy > 0) {
        if (!this.repairContainer(creep)) {
          return;
        }
        let container = creep.containersNearby()[0];
        if (container) {
          creep.transfer(container, RESOURCE_ENERGY);
        }
      }
    }
  },

  /* return false if the container is broken and we cannot repair it */
  repairContainer: function(creep) {
    let containers = creep.containersNearby();
    let container = _.filter(containers, function(c) { return c.hitsMax / c.hits > 2; })[0];
    if (container) {
      if (creep.carry.energy > creep.carryCapacity / 2) {
        creep.repair(container);
        return true;
      }
      return false;
    }
    return true;
  },

  /**
   * @param {Creep} creep
   * @param {RoomPosition} position
   **/
  canGo: function(creep, position) {
    return creep.memory.status != 'filling' || position.findInRange(FIND_SOURCES, 1).length > 0;
  },

  /**
   * @param {Creep} creep
   **/
  moveOut(creep) {
    if (creep.memory.status == "filling") {
      let source = creep.pos.findInRange(FIND_SOURCES, 1)[0];
      if (!source) {
        return;
      }
      let positions = source.freeSlots();
      let position = creep.pos.findClosestByPath(positions, {ignoreCreeps: true});
      creep.moveTo(position);
      creep.say("ok");
    }
  }
};

module.exports = roleHarvester;
