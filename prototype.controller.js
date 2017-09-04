Object.defineProperty(StructureController.prototype, 'memory', {
  get: function() {
    if (!Memory.controllers) {
      Memory.controllers = {};
    }
    if (!Memory.controllers[this.id]) {
      this.memory = {};
    }
    return Memory.controllers[this.id];
  },

  set: function(value) {
    if (!Memory.controllers) {
      Memory.controllers = {};
    }
    if (!Memory.controllers[this.id]) {
      Memory.controllers[this.id] == {};
    }
    Memory.controllers[this.id] = value;
  }
});
StructureController.prototype.slots = function() {
  if (!this._slots) {
    let slots;
    if (!this.memory.slots) {
      slots = _(
        this.room.lookForAtArea(LOOK_TERRAIN, this.pos.y - 3, this.pos.x - 3, this.pos.y + 3, this.pos.x + 3, true)
      ).filter(area => { return area.type == "terrain" && area.terrain != "wall" }).
        map(slot => { return new RoomPosition(slot.x, slot.y, this.room.name); }).
        value();

      this.memory.slots = slots;
    }
    this._slots = this.memory.slots.map(function(pos) { return new RoomPosition(pos.x, pos.y, pos.roomName); });
  }
  return this._slots;
}

StructureController.prototype.freeSlots = function() {
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
