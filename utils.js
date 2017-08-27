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
      this.cachedRoles = ['harvester', 'hauler', 'upgrader', 'builder', 'repairer'];
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

  structuresNeedingEnergyTypes: function() {
    if (!this.__structuresNeedingEnergyTypes) {
      this.__structuresNeedingEnergyTypes = [STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_EXTENSION,
        STRUCTURE_CONTAINER, STRUCTURE_STORAGE];
    }
    return this.__structuresNeedingEnergyTypes;
  },

  /**
   * @param {Room} room
   **/
  structuresNeedingEnergy: function(room) {
    if (!this.__structuresNeedingEnergy) {
      var structureEnergyTypes =
        [STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_EXTENSION, STRUCTURE_LINK];
      var structureStorageTypes = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE];

      this.__structuresNeedingEnergy = room.find(FIND_STRUCTURES, {
        filter: (s) => {
          return (structureEnergyTypes.includes(s.structureType) && s.energy < s.energyCapacity) ||
            (structureStorageTypes.includes(s.structureType) &&
             s.store[RESOURCE_ENERGY] < s.storeCapacity);
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

  harvestedSources: function(room) {
    return room.find(FIND_SOURCES, { filter: {  hasAssociatedContainer: true } });
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

  /**
   * @param {RoomObject} room
   **/
  needMoreHarvesters: function(spawn) {
    let room = spawn.room;
    let harvesters = room.find(FIND_CREEPS, {
      filter:  { memory: { role: 'harvester', roomName: room.name }
      } });
    let nbWorkParts = _(harvesters).filter(function(h) {
      // let timeToMoveToCurrentDestination = eta.timeToDestination(h, spawn.pos);
      let timeToSpawn = h.body.length * 3;
      return timeToSpawn < h.ticksToLive;
    }).map('body').flatten().reduce(function(sum, p) {
      if (p.type == 'work') {
        return sum + 1;
      }
      return sum;
    }, 0);
    let nbSources = room.find(FIND_SOURCES).length;
    return nbWorkParts < nbSources * 5;
  },

  clean: function() {
    this.__structuresNeedingEnergy = undefined;
    this.__structuresGivingEnergy = undefined;
  }
};

module.exports = utils;
