var lock = {
  lock: function(entity, resource, score) {
    this.init();
    locked = this.get(resource.id)
    if (locked == undefined) {
      this.applyLock(entity, resource, score);
      return true;
    }
    else {
      lock_score = locked.score;
      if (score < lock_score) {
        entity2 = Game.getObjectById(locked.entity);
        if (entity2 != null) {
          entity2.memory.lock = undefined;
        }
        this.applyLock(entity, resource, score);
        return true;
      }
    }
    return false;
  },

  applyLock: function(entity, resource, score) {
    Memory.lock[resource.id] = { entity: entity.id, score: score };
    if (entity.memory != undefined)
      entity.memory.lock = resource.id;
  },

  lockAllResources: function(spawn) {
    console.log("LOCKING");
    resources = this.resources(spawn.room);
    for(r of resources) {
      this.lock(spawn, r, 0);
    }
  },

  releaseAllResources: function(spawn) {
    console.log("UNLOCKING");
    resources = this.resources(spawn.room);
    for(r of resources) {
      locked = this.get(r.id);
      if (locked != undefined && locked.entity == spawn.id)
        this.remove(r.id);
    }
  },

  resources: function(room) {
    return room.find(FIND_STRUCTURES, {
      filter: (s) => {
        structureTypes = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION];
        return (structureTypes.includes(s.structureType));
      }
    });
  },

  get: function(resource_id) {
    return Memory.lock[resource_id];
  },

  remove: function(resource_id) {
    delete Memory.lock[resource_id];
  },

  release: function(entity, resource) {
    // console.log("RELEASE " + entity.name + " " + resource.pos.x + "," + resource.pos.y + " (" + resource.id + ")");
    this.remove(resource.id);
    if (entity != undefined)
      delete entity.memory.lock;
    // console.log(Object.keys(Memory.lock).length);
  },

  releaseCreep: function(entity) {
    // console.log("RELEASE CREEP " + entity.name);
    locked = entity.memory.lock;
    if (locked != undefined) {
      this.remove(locked)
    }
    delete entity.memory.lock
    // console.log(Object.keys(Memory.lock).length);
  },

  clean: function() {
    to_remove = [];
    for (key in Memory.lock) {
      lock = Memory.lock[key];
      id = lock.entity;
      entity = Game.getObjectById(id)
      if (entity == null || entity == undefined || entity.memory.lock != key)
        to_remove.push(key);
    }
    for (var i = 0, len = to_remove.length; i < len; i++) {
      console.log("Deleting " + key);
      delete Memory.lock[key];
    }
  },

  resetAll: function() {
    Memory.lock = {};
    for(var name in Game.creeps) {
      var creep = Game.creeps[name];
      creep.memory.lock = undefined;
    }
  },

  init: function() {
    if (Memory.lock == undefined) {
      Memory.lock = {};
    }
  }
};

module.exports = lock;
