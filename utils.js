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
      this.cachedRoles = ["harvester", "hauler", "upgrader", "builder", "repairer"];
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
    if (!this.__structuresNeedingEnergyTypes) {
      this.__structuresNeedingEnergyTypes =
        [STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_EXTENSION, STRUCTURE_CONTAINER, STRUCTURE_STORAGE];
    }
    return this.__structuresNeedingEnergyTypes;
  },

  /**
   * @param {Room} room
   **/
  structuresNeedingEnergy: function(room) {
    if (!this.__structuresNeedingEnergy) {
      var structureEnergyTypes = [STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_EXTENSION];
      var structureStorageTypes = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE];

      this.__structuresNeedingEnergy = room.find(FIND_STRUCTURES, {
        filter: (s) => {
          return (structureEnergyTypes.includes(s.structureType) && s.energy < s.energyCapacity) ||
            (structureStorageTypes.includes(s.structureType) && s.store[RESOURCE_ENERGY] < s.storeCapacity);
        }
      });
    }
    return this.__structuresNeedingEnergy;
  },

  /**
   * @param {Room} room
   **/
  structuresGivingEnergy: function(room) {
    if (!this.__structuresGivingEnergy) {
      var structureStorageTypes = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE];

      this.__structuresGivingEnergy = room.find(FIND_STRUCTURES, {
        filter: (s) => {
          return (s.structureType == STRUCTURE_EXTENSION && s.energy > 0) ||
            (s.structureType == STRUCTURE_SPAWN && s.energy > 100) ||
            (structureStorageTypes.includes(s.structureType) && s.store[RESOURCE_ENERGY] > 0);
        }
      });
    }
    return this.__structuresGivingEnergy;
  },

  isHarvestingContainer: function(structure) {
    if (structure.structureType != STRUCTURE_CONTAINER)
      return false;
    if (this.harvestingContainers(structure.room).includes(structure.id))
      return true;
    return false;
  },

  harvestingContainers: function(room) {
    if (!this.__harvestingContainers) {
      var containers = room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_CONTAINER });
      var sources = room.find(FIND_SOURCES);
      this.__harvestingContainers = [];
      for (let c of containers) {
        var source = c.pos.findClosestByRange(sources);
        if (this.distance(c, source) <= 2)
          this.__harvestingContainers.push(c.id);
      }
    }
    return this.__harvestingContainers;
  },

  /**
   * @param {RoomObject} object1
   * @param {RoomObject} object2
   **/
  distance: function(object1, object2) {
    return Math.max(Math.abs(object1.pos.x - object2.pos.x), Math.abs(object1.pos.y - object2.pos.y));
  },

  clean: function() {
    this.__structuresNeedingEnergy = undefined;
    this.__structuresGivingEnergy = undefined;
  }
};

module.exports = utils
