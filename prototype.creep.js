var lock = require('lock');
var eta = require('utils.eta');
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
// };
