var lock = {
  lock: function(entity, resource, score) {
    this.log('call lock ' + this.structureToString(resource) + ' -> ' +
        this.entityToString(entity) + ' ' + score);
    this.init();
    var locked = this.get(resource.id);
    if (locked == undefined) {
      this.applyLock(entity, resource, score);
      return true;
    } else {
      var lockScore = locked.score;
      if (score < lockScore) {
        var entity2 = Game.getObjectById(locked.entity);
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
    if (entity.memory != undefined) {
      entity.memory.lock = resource.id;
    }
    this.prettyPrint();
  },

  lockAllResources: function(spawn) {
    if (spawn.room.harvestOnly) {
      return;
    }
    this.log('lockAll');
    spawn.room.harvestOnly = true;
    var resources = this.resources(spawn.room);
    for (let r of resources) {
      this.lock(spawn, r, 0);
    }
    this.prettyPrint();
  },

  releaseAllResources: function(spawn) {
    if (!spawn.room.harvestOnly) {
      return;
    }
    this.log('releaseAll');
    spawn.room.harvestOnly = false;
    var resources = this.resources(spawn.room);
    for (let r of resources) {
      var locked = this.get(r.id);
      if (locked != undefined && locked.entity == spawn.id) {
        this.log('releasing');
        this.remove(r.id);
      }
    }
    this.prettyPrint();
  },

  resources: function(room) {
    return room.find(FIND_STRUCTURES, {
      filter: (s) => {
        var structureTypes = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION];
        return (structureTypes.includes(s.structureType));
      }
    });
  },

  get: function(resourceId) {
    return Memory.lock[resourceId];
  },

  remove: function(resourceId) {
    delete Memory.lock[resourceId];
  },

  release: function(entity, resource) {
    this.remove(resource.id);
    if (entity != undefined) {
      delete entity.memory.lock;
    }
    this.prettyPrint();
  },

  releaseCreep: function(entity) {
    var locked = entity.memory.lock;
    if (locked != undefined) {
      this.remove(locked);
    }
    delete entity.memory.lock;
    this.prettyPrint();
  },

  clean: function() {
    var toRemove = [];
    for (let key in Memory.lock) {
      var lock = Memory.lock[key];
      var id = lock.entity;
      var entity = Game.getObjectById(id);
      if (entity == null || entity == undefined || entity.memory.lock != key) {
        toRemove.push(key);
      }
    }
    for (var i = 0, len = toRemove.length; i < len; i++) {
      var key = toRemove[i];
      this.log('Deleting ' + key);
      delete Memory.lock[key];
    }
  },

  resetAll: function() {
    Memory.lock = {};
    for (var name in Game.creeps) {
      var creep = Game.creeps[name];
      creep.memory.lock = undefined;
    }
  },

  init: function() {
    if (Memory.lock == undefined) {
      Memory.lock = {};
    }
  },

  prettyPrint: function() {
    this.log('--- LOCK ---');
    for (let key in Memory.lock) {
      var locked = Memory.lock[key];
      var creep = Game.getObjectById(locked.entity);
      var structure = Game.getObjectById(key);
      this.log(this.structureToString(structure) + ' -> ' + this.entityToString(creep) + ' ' +
          locked.score);
    }
    this.log('------------');
  },

  entityToString: function(object) {
    return object.name;
  },

  structureToString: function(object) {
    if (!object) {
      return '[]';
    }
    return object.structureType + this.posToString(object);
  },

  posToString: function(object) {
    return '[' + object.pos.x + ' ' + object.pos.y + ']';
  },

  log: function(message) {
    // console.log('['+Game.time+']'+message);
  },

  /**
   * @param {RoomObject} room
   **/
  visualDebug: function(room) {
    for (let key in Memory.lock) {
      var locked = Memory.lock[key];
      var creep = Game.getObjectById(locked.entity);
      var structure = Game.getObjectById(key);
      if (creep && structure) {
        room.visual.line(creep.pos.x, creep.pos.y, structure.pos.x, structure.pos.y);
      }
    }
  }
};

module.exports = lock;
