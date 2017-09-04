var lock = require('lock');
var eta = require('utils.eta');
var utils = require('utils');
// module.exports = function() {
  /**
   * @property {Room} nativeRoom
   * @name Creep#nativeRoom
   **/
  Object.defineProperty(Creep.prototype, 'nativeRoom', {
    /**
     * @type {Room}
     **/
    get: function() {
      return Game.rooms[this.memory.roomName];
    }
  });

  Creep.prototype.sortByDistance = function(objects) {
    let distances = {};
    for (i = 0; i < objects.length; i++) {
      let s = objects[i];
      // distances[s] = this.pos.getRangeTo(s);
      distances[s] = this.timeToDestination(s);
    }
    return objects.sort((s1, s2) => { return distances[s1] - distances[s2]; });
  };

  Creep.prototype.lockClosest = function(objects) {
    // console.log(objects.length);
    let distances = {};
    for (i = 0; i < objects.length; i++) {
      let s = objects[i];
      // distances[s] = this.pos.getRangeTo(s);
      distances[s] = this.timeToDestination(s);
    }
    let resources = objects.sort((s1, s2) => { return distances[s1] - distances[s2]; });
    var idx = 0;
    var canLock = false;
    while (idx < resources.length && !canLock) {
      var s = resources[idx];
      let canLock = lock.lock(this, s, Game.time + distances[s]);
      if (canLock) {
        return s;
      }
      idx ++;
    }
    return null;
  };

  Creep.prototype.lockClosest2 = function(resources) {
    var idx = 0;
    var canLock = false;
    let nbResources = resources.length;
    while (idx < nbResources && !canLock) {
      let s = this.pos.findClosestByPath(resources);
      let canLock = lock.lock(this, s, Game.time + this.timeToDestination(s));
      if (canLock) {
        return s;
      }
      _.remove(resources, (r) => { return r.id == s.id; });
      idx ++;
    }
    return null;
  };

  Creep.prototype.timeToDestination = function(destination) {
    return eta.timeToDestination(this, destination);
  };

Creep.prototype.blockingCreep = function() {
  if (!this._isMoving || !this._blockingCreep) {
    return undefined;
  }
  return this._blockingCreep;
}

if (!Creep.prototype._moveTo) {
  Creep.prototype._moveTo = Creep.prototype.moveTo;
  Creep.prototype.moveTo = function(position, options = {}) {
    options.ignoreCreeps = true;
    options.reusePath = 50;
    if (this.isBlocked()) {
      let duration = Game.time - this.memory.blocked;
      this.say(duration);
      if (duration > 2) {
        options.ignoreCreeps = false;
        options.reusePath = 1;
      }
    }
    return this._moveTo(position, options);
  }
}

if (!Creep.prototype._move) {
  Creep.prototype._move = Creep.prototype.move;
  Creep.prototype.move = function(direction) {
    this._isMoving = true;
    let returnValue = this._move(direction);
    if (returnValue == OK) {
      let nextPos = this.pos.onThe(direction);
      this._blockingCreep = nextPos.lookFor(LOOK_CREEPS)[0];
      if (this._blockingCreep) {
        this._blockingCreep.moveOut(this.pos);
        // this._blockingCreep.say("B");
      }
    }
    return returnValue;
  }

}

Creep.prototype.moveOut = function(position) {
  if (this.isMoving()) {
    return;
  }
  let role = utils.role(this.memory.role);
  if (role.canGo && role.canGo(this, position)) {
    this.moveTo(position);
    return;
  }
  if (role.moveOut) {
    role.moveOut(this);
  }
}

Creep.prototype.carriedWeight = function() {
  if (!this._carriedWeight) {
    this._carriedWeight = _.sum(this.carry);
  }
  return this._carriedWeight;
}

Creep.prototype.isBlocked = function() {
  return false;
  return this.memory.blocked != undefined &&
    this.memory.blockedX == this.pos.x &&
    this.memory.blockedY == this.pos.y;
};

Creep.prototype.block = function() {
  if (this.memory.blockedX != this.pos.x || this.memory.blockedY != this.pos.y) {
    this.memory.blockedX = this.pos.x;
    this.memory.blockedY = this.pos.y;
    this.memory.blocked = Game.time;
  }
}

Creep.prototype.isMoving = function() {
  return this._isMoving;
}

Creep.prototype.containersNearby = function() {
  if (!this._containersNearby) {
    this._containersNearby = this.pos.findInRange(FIND_STRUCTURES, 1, {
      filter: { structureType: STRUCTURE_CONTAINER }
    });
  }
  return this._containersNearby;
};

Creep.prototype.nextMovePoint = function() {
  this.memory._move;
}
