var lock = {
  lock: function(entity, resource, score) {
    this.init();
    if (Memory.lock[resource.id] == undefined) {
      Memory.lock[resource.id] = { entity: entity.id, score: score };
      entity.memory.lock = resource.id
      return true;
    }
    else {
      lock_score = Memory.lock[resource.id].score;
      if (score < lock_score) {
        entity = Game.getObjectById(Memory.lock[resource.id].entity);
        if (entity != null)
          entity.memory.lock = undefined;
        Memory.lock[resource.id] = { entity: entity.id, score: score };
        entity.memory.lock = resource.id
        return true;
      }
    }
    return false;
  },

  release: function(entity, resource) {
    delete Memory.lock[resource.id];
    if (entity != undefined)
      delete entity.memory.lock;
  },

  releaseCreep: function(entity) {
    locked = entity.memory.lock;
    if (locked) {
      delete Memory.lock[locked];
    }
  },

  init: function() {
    if (Memory.lock == undefined) {
      Memory.lock = {};
    }
  }
};

module.exports = lock;
