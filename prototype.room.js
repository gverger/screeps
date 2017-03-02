module.exports = function() {
  Room.prototype.structuresWithEnergy = function() {
    if (this.__structuresWithEnergyComputedTime !== Game.time) {
      this.__structuresWithEnergyComputedTime = Game.time;
      let structureStorageTypes = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE];

      if (this.harvestOnly) {
        this.__structuresWithEnergy = this.find(FIND_STRUCTURES, {
          filter: (s) => {
            if (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) {
              return false;
            }
            if (structureStorageTypes.includes(s.structureType)) {
              return !s.isForHarvest && s.store[RESOURCE_ENERGY] > 0;
            }
            return false;
          }
        });
      } else {
        this.__structuresWithEnergy = this.find(FIND_STRUCTURES, {
          filter: (s) => {
            return (s.structureType == STRUCTURE_EXTENSION && s.energy > 0) ||
              (s.structureType == STRUCTURE_SPAWN && s.energy > 100) ||
              (structureStorageTypes.includes(s.structureType) && s.store[RESOURCE_ENERGY] > 0);
          }
        });
      }
    }
    return this.__structuresWithEnergy;
  };

  Object.defineProperty(Room.prototype, 'harvestOnly', {
    get: function() {
      return this.memory.harvestOnlyMode;
    },

    set: function(value) {
      this.memory.harvestOnlyMode = value;
    }
  });
};
