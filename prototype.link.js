// module.exports = function() {
  let prototype = StructureLink.prototype;
  Object.defineProperty(prototype, 'memory', {
    get: function() {
      if (!Memory.links) {
        Memory.links = {};
      }
      if (!Memory.links[this.id]) {
        this.memory = {};
      }
      return Memory.links[this.id];
    },

    set: function(value) {
      if (!Memory.links) {
        Memory.links = {};
      }
      if (!Memory.links[this.id]) {
        Memory.links[this.id] == {};
      }
      Memory.links[this.id] = value;
    }
  });

  Object.defineProperty(prototype, 'isForHarvest', {
    get: function() {
      if (this.memory.isForHarvest == undefined) {
        let sources = this.pos.findInRange(FIND_SOURCES, 1);
        this.memory.isForHarvest = sources.length > 0;
        sources.forEach(s => { s.associatedContainer = this; });
      }
      return this.memory.isForHarvest;
    }
  });

  prototype.acceptsWithdrawsFrom = function(roleName) {
    if (this.isForHarvest) {
      return false;
    }
    return true;
  };

  Object.defineProperty(prototype, 'isFull', {
    get: function() {
      return this.energy == this.energyCapacity;
    }
  });

  Object.defineProperty(prototype, 'hasEnergy', {
    get: function() {
      return this.energy > this.energyCapacity / 3;
    }
  });

  prototype.run = function() {
    if (this.isForHarvest && this.isFull && this.cooldown == 0) {
      let receiver = this.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: function(structure) {
          return structure.structureType == STRUCTURE_LINK &&
            !structure.isFull &&
            !structure.isForHarvest;
        }
      });
      if (!receiver) {
        return;
      }
      this.transferEnergy(receiver);
    }
  };
// };

