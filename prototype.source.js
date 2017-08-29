// module.exports = function() {
  Object.defineProperty(Source.prototype, 'memory', {
    get: function() {
      if (!Memory.sources) {
        Memory.sources = {};
      }
      if (!Memory.sources[this.id]) {
        this.memory = {};
      }
      return Memory.sources[this.id];
    },

    set: function(value) {
      if (!Memory.sources) {
        Memory.sources = {};
      }
      if (!Memory.sources[this.id]) {
        Memory.sources[this.id] == {};
      }
      Memory.sources[this.id] = value;
    }
  });

  Object.defineProperty(Source.prototype, 'hasAssociatedContainer', {
    get: function() {
      return (this.associatedContainer !== null && this.associatedContainer !== undefined);
    }
  });

  Object.defineProperty(Source.prototype, 'associatedContainer', {
    get: function() {
      return Game.getObjectById(this.memory.associatedContainerId);
    },

    set: function(value) {
      this.memory.associatedContainerId = value.id;
    }
  });

Source.prototype.nbOfHarvestingSlots = function() {
  return 9 - _.countBy(this.room.lookForAtArea(LOOK_TERRAIN, this.pos.y - 1, this.pos.x - 1, this.pos.y + 1, this.pos.x + 1, true), 'terrain').wall;
};
// };
