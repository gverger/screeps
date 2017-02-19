var utils = require('utils');

var actionBuildRoads = {
  buildRoads: function(room) {
    if (Memory.roads) {
      return null;
    }
    this.usedPoints(room);
    var sources = room.find(FIND_SOURCES);
    for (let source of sources) {
      this.buildTheRoad(room, room.controller.pos, source.pos);
      var spawn = utils.spawnOfRoom(room);
      this.buildTheRoad(room, spawn.pos, source.pos);
      Memory.roads = true;
    }
  },

  buildTheRoad: function(room, pos1, pos2) {
    var path = pos1.findPathTo(pos2, { ignoreCreeps: true });
    for (i = 0; i < path.length; i++) {
      var step = path[i];
      room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
    };
  },

  /* @function usedPoints
   * @param {Room}
   */
  usedPoints: function(room) {
    if (room.memory.usedPoints == undefined) {
      room.memory.usedPoints = (new PathFinder.CostMatrix).serialize();
    }
    /**
     * @type {PathFinder.CostMatrix}
     **/
    var points = PathFinder.CostMatrix.deserialize(room.memory.usedPoints);
    var creeps = Game.creeps;
    for (var name in creeps) {
      /**
       * @type {Creep}
       **/
      var creep = Game.creeps[name];
      if (creep.room != room || creep.fatigue > 0) {
        continue;
      }
      points.set(creep.pos.x, creep.pos.y, points.get(creep.pos.x, creep.pos.y) + 1);
    }

    this.bestRoutePoint(points, room);
    room.memory.usedPoints = points.serialize();
  },

  /**
   * @function bestRoutePoint
   * @param {PathFinder.CostMatrix} matrix
   * @param {Room} room
   **/
  bestRoutePoint: function(matrix, room) {
    if (Game.time % 10 != 0) {
      return;
    }
    var max = 0;
    var maxX = 0;
    var maxY = 0;
    var isRoad = new PathFinder.CostMatrix;
    var roads = room.find(FIND_STRUCTURES);
    for (let road of roads) {
      isRoad.set(road.pos.x, road.pos.y, 1);
    }
    for (var x = 0; x < 50; x++) {
      for (var y = 0; y < 50; y++) {
        if (isRoad.get(x, y)) {
          continue;
        }
        var value = matrix.get(x, y);
        if (max < value) {
          max = value;
          maxX = x;
          maxY = y;
        }
        // if (value > 0) {
        //   matrix.set(x, y, value - 1);
        // }
      }
    }
    if (max > 10) {
      room.createConstructionSite(maxX, maxY, STRUCTURE_ROAD);
    }
  }
};

module.exports = actionBuildRoads;
