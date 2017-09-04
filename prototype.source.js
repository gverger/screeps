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
  return this.slots().length;
};

Source.prototype.slots = function() {
  if (!this._slots) {
    let slots;
    if (!this.memory.slots) {
      slots = _(
        this.room.lookForAtArea(LOOK_TERRAIN, this.pos.y - 1, this.pos.x - 1, this.pos.y + 1, this.pos.x + 1, true)
      ).filter(area => { return area.type == "terrain" && area.terrain != "wall" }).
        map(slot => { return new RoomPosition(slot.x, slot.y, this.room.name); }).
        value();

      this.memory.slots = slots;
    }
    this._slots = this.memory.slots.map(function(pos) { return new RoomPosition(pos.x, pos.y, pos.roomName); });
  }
  return this._slots;
}

Source.prototype.freeSlots = function() {
  if (!this._freeSlots) {
  /* @type {Array} slots */
  let slots = this.slots();
  let controller = this;
    this._freeSlots =
      slots.filter(function(position) {
        return controller.room.lookForAt(LOOK_CREEPS, position).length == 0
      });
  }
  return this._freeSlots;
}
// };
