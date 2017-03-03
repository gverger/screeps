var lock = require('lock');
var eta = require('utils.eta');
module.exports = function() {
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
      distances[s] = this.pos.findPathTo(s).length;
    }
    return objects.sort((s1, s2) => { return distances[s1] - distances[s2]; });
  };

  Creep.prototype.lockClosest = function(resources) {
    resources = this.sortByDistance(resources);
    var idx = 0;
    var canLock = false;
    while (idx < resources.length && !canLock) {
      var s = resources[idx];
      let canLock = lock.lock(this, s, Game.time + this.timeToDestination(s));
      if (canLock) {
        return s;
      }
      idx ++;
    }
    return null;
  };

  Creep.prototype.timeToDestination = function(destination) {
    return eta.timeToDestination(this, destination);
  };
};
