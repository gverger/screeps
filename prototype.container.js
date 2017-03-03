module.exports = function() {
  Object.defineProperty(StructureContainer.prototype, 'memory', {
    get: function() {
      if (!Memory.containers) {
        Memory.containers = {};
      }
      if (!Memory.containers[this.id]) {
        this.memory = {};
      }
      return Memory.containers[this.id];
    },

    set: function(value) {
      if (!Memory.containers) {
        Memory.containers = {};
      }
      if (!Memory.containers[this.id]) {
        Memory.containers[this.id] == {};
      }
      Memory.containers[this.id] = value;
    }
  });

  Object.defineProperty(StructureContainer.prototype, 'isForHarvest', {
    get: function() {
      if (this.memory.isForHarvest == undefined) {
        let sources = this.pos.findInRange(FIND_SOURCES, 1);
        this.memory.isForHarvest = sources.length > 0;
        sources.forEach(s => { s.associatedContainer = this; });
      }
      return this.memory.isForHarvest;
    }
  });

  StructureContainer.prototype.acceptsWithdrawsFrom = function(roleName) {
    if (this.isForHarvest && this.room.harvestOnly) {
      return roleName == 'hauler';
    }
    return true;
  };

  Object.defineProperty(StructureContainer.prototype, 'hasEnergy', {
    get: function() {
      return this.store[RESOURCE_ENERGY] > 0;
    }
  });
};
