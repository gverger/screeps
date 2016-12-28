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
      this.cachedRoles = ["harvester", "upgrader", "builder", "repairer", "hauler"];
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
  },

  structuresNeedingEnergyTypes: function() {
    return [STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_EXTENSION, STRUCTURE_CONTAINER, STRUCTURE_STORAGE];
  },

  /**
   * @param {Room} room
   **/
  structuresNeedingEnergy: function(room) {
    // this.__structuresNeedingEnergy = undefined;
    if (!this.cached_SNE) {
      console.log("COMPUTE");
      var structureEnergyTypes = [STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_EXTENSION];
      var structureStorageTypes = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE];

      this.cached_SNE = room.find(FIND_STRUCTURES, {
        filter: (s) => {
          return (structureEnergyTypes.includes(s.structureType) && s.energy < s.energyCapacity) ||
            (structureStorageTypes.includes(s.structureType) && s.store[RESOURCE_ENERGY] < s.storeCapacity);
        }
      });
    }
    return this.cached_SNE;
  }
};

module.exports = utils
