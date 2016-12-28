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
      this.cachedRoles = ["harvester", "upgrader", "builder", "repairer", "carryier"];
    }
    return this.cachedRoles;
  },

  _roles: {},
  /** @param {string} roleName **/
  role: function(roleName) {
    if(!this._roles[roleName]) {
      this._roles[roleName] = require('role.' + roleName);
    }
    return this._roles[roleName];
  }
};

module.exports = utils
