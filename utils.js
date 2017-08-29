// var eta = require('utils.eta');
var utils = {
  /**
   * @param {Room} room
   * @return {Spawn}
   **/
  spawnOfRoom: function(room) {
    return _(Game.spawns).find((s) => s.room == room);
  },

  roles: function() {
    if (!this.cachedRoles) {
      this.cachedRoles = ['harvester', 'hauler', 'remote-miner', 'claimer', 'upgrader', 'builder', 'repairer'];
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
  }
};

module.exports = utils;
