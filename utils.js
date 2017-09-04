// var eta = require('utils.eta');
var utils = {
  roles: function() {
    if (!this.cachedRoles) {
      this.cachedRoles = ['harvester', 'hauler', 'stealer', 'source-blocker', 'attacker', 'remote-miner', 'claimer', 'upgrader', 'builder', 'repairer'];
    }
    return this.cachedRoles;
  },

  _roles: {},
  /** @param {string} roleName **/
  role: function(roleName) {
    if (!this._roles) {
      this._roles = {};
    }
    if (!this._roles[roleName]) {
      this._roles[roleName] = require('role.' + roleName);
    }
    return this._roles[roleName];
  },

  /**
   * @param {RoomObject} object1
   * @param {RoomObject} object2
   **/
  distance: function(object1, object2) {
    return Math.max(
        Math.abs(object1.pos.x - object2.pos.x),
        Math.abs(object1.pos.y - object2.pos.y)
        );
  },

  clean: function() {
    this.__structuresNeedingEnergy = undefined;
    this.__structuresGivingEnergy = undefined;
  },

  isBlockingStructureType: function(structureType) {
    return structureType == STRUCTURE_EXTENSION ||
      structureType == STRUCTURE_LINK ||
      structureType == STRUCTURE_STORAGE ||
      structureType == STRUCTURE_SPAWN ||
      structureType == STRUCTURE_WALL ||
      structureType == STRUCTURE_TOWER;
  }
};

module.exports = utils;
