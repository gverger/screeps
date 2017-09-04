var transferEnergy = require('action.transfer.energy');

var roleStealer = {
  updateStatus: function(creep) {
    if (this.prey(creep) && !this.prey(creep).hasEnergy) {
      delete creep.memory.preyId;
    }
    if (creep.memory.status == "backing" && creep.carry.energy == 0) {
      creep.memory.status = "searching";
    }
    else if (creep.memory.status == "searching" && this.prey(creep)) {
      creep.memory.status = "stealing";
    }
    if (creep.memory.status == "stealing") {
      if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.status = "backing";
      } else if (!this.prey(creep)) {
        creep.memory.status = "searching";
      }
    }
  },

  prey: function(creep) {
    if (!creep.memory.preyId)
      return undefined;
    return Game.getObjectById(creep.memory.preyId);
  },

  run: function(creep) {
    this.updateStatus(creep);

    if (creep.memory.status == 'stealing') {
      this.stealing(creep);
    }
    else if (creep.memory.status == 'searching') {
      this.searching(creep);
    }
    else if (creep.memory.status == 'backing') {
      this.backing(creep);
    }
  },

  /**
   * @param {Creep} creep
   **/
  backing: function(creep) {
    if (creep.room.name != creep.nativeRoom.name) {
      creep.moveTo(creep.nativeRoom.controller, {ignoreCreeps: true, reusePath: 50});
      return;
    }
    transferEnergy.transfer(creep);
  },

  /**
   * @param {Creep} creep
   **/
  searching: function(creep) {
    let flag = _.find(Game.flags, { name: creep.memory.flagName });
    if (!flag) {
      return;
    }
    if (!flag.room || creep.room.name != flag.room.name) {
      creep.moveTo(flag, {ignoreCreeps: true, reusePath: 50});
      return;
    }
    let hostile = creep.pos.findClosestByRange(creep.room.structuresWithEnergy());
    if (!hostile) {
      creep.moveTo(flag, {ignoreCreeps: true, reusePath: 50});
      delete creep.memory.preyId;
      return;
    }
    if (hostile) {
      creep.memory.preyId = hostile.id;
      this.goHarvest(creep, hostile);
    }
  },

  stealing: function(creep) {
    let structureToSteal = Game.getObjectById(creep.memory.preyId);
    if (!structureToSteal) {
      delete creep.memory.preyId;
      return;
    }
    this.goHarvest(creep, structureToSteal);

  },

  goHarvest: function(creep, structure) {
    var errCode = creep.withdraw(structure, RESOURCE_ENERGY);
    if (structure.amount) {
      errCode = creep.pickup(structure);
    }
    if (errCode == ERR_NOT_IN_RANGE) {
      creep.moveTo(structure, {ignoreCreeps: true, visualizePathStyle: {}});
    }
    if (errCode != OK && errCode != ERR_NOT_IN_RANGE) {
      creep.say(errCode);
    }
  },


};

module.exports = roleStealer;


