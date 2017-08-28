var transferEnergy = require('action.transfer.energy');
/**
 * Remote Miners should have
 * memory.flagId set on
 **/
var remoteMiner = {
  /**
   * @param {Creep} creep
   **/
  updateStatus: function(creep) {
    let workParts = _.filter(creep.body, { type: WORK }).length;
    if (creep.memory.status !== 'transfering' && (creep.carry.energy + 2 * workParts > creep.carryCapacity)) {
      const flag = _.find(Game.flags, { name: creep.memory.flagName });
      const futureSpawn =
        flag.room.find(FIND_CONSTRUCTION_SITES, { filter: { structureType: STRUCTURE_SPAWN }})[0]
      if (futureSpawn) {
        creep.memory.status = 'building';
        creep.memory.constructionSiteId = futureSpawn.id;
      }
      else {
        creep.memory.status = 'transfering';
      }
    } else if (creep.memory.status !== 'filling' && creep.carry.energy == 0) {
      creep.memory.status = 'filling';
    }
  },
  /**
   * @param {Creep} creep
   **/
  run: function(creep) {
    this.updateStatus(creep);
    if (creep.memory.status === 'transfering') {
      return this.transfering(creep);
    }
    if (creep.memory.status === 'filling') {
      return this.filling(creep);
    }
    return this.building(creep);
  },

  /**
   * @param {Creep} creep
   **/
  transfering: function(creep) {
    if (creep.room !== creep.nativeRoom) {
      const exitDir = creep.room.findExitTo(creep.nativeRoom);
      const exit = creep.pos.findClosestByRange(exitDir);
      creep.moveTo(exit);
      return;
    }
    transferEnergy.transfer(creep);
  },

  /**
   * @param {Creep} creep
   **/
  filling: function(creep) {
    let flag = _.find(Game.flags, { name: creep.memory.flagName });
    if (!flag) return;
    if (creep.pos.isNearTo(flag)) {
      let source = creep.room.find(FIND_SOURCES, {filter: (s) => {return s.pos.isEqualTo(flag);}})[0];
      creep.harvest(source);
      return;
    }
    creep.moveTo(flag, {reusePath: 50});
  },

  /**
   * @param {Creep} creep
   **/
  building: function(creep) {
    const site = Game.getObjectById(creep.memory.constructionSiteId);
    const errCode = creep.build(site);
    if (errCode != OK && errCode != ERR_NOT_IN_RANGE) {
      creep.say(errCode);
    }
    if (errCode == ERR_NOT_IN_RANGE) {
      creep.moveTo(site, {visualizePathStyle: {}});
    }
  }
}

module.exports = remoteMiner;
