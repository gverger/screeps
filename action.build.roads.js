var actionBuildRoads = {
  buildRoads: function(room) {
    this.usedPoints(room);
    // if (Memory.roads) {
      return null;
    // }
    var source = room.controller.pos.findClosestByRange(room.find(FIND_SOURCES));
    if (source != null) {
      path = room.controller.pos.findPathTo(source.pos, { ignoreCreeps: true });
      for (i = 0; i < path.length; i++) {
        step = path[i];
        room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
        if (step.dx == 1 || step.dx == -1) {
          room.createConstructionSite(step.x, step.y + 1, STRUCTURE_ROAD);
        }
        if (step.dy == 1 || step.dy == -1) {
          room.createConstructionSite(step.x + 1, step.y, STRUCTURE_ROAD);
        }
      };
      Memory.roads = true;
    }
  },

  /* @function usedPoints
   * @param {Room}
   */
  usedPoints: function(room) {
    if (room.memory.usedPoints == undefined)
      room.memory.usedPoints = (new PathFinder.CostMatrix).serialize();
    /**
     * @type {PathFinder.CostMatrix}
     **/
    var points = PathFinder.CostMatrix.deserialize(room.memory.usedPoints);
    var creeps = Game.creeps;
    for(var name in creeps) {
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
    if (Game.time % 10 != 0)
      return;
    var max = 0;
    var max_x = 0;
    var max_y = 0;
    for (var x = 0; x < 50; x++) {
      for (var y = 0; y < 50; y++) {
        isRoad = room.lookForAt(LOOK_STRUCTURES, x, y).some(
            (s) => { return s.structureType == 'road'}
            );
        if (isRoad)
          continue;

        if (max < matrix.get(x, y)) {
          max = matrix.get(x, y);
          max_x = x;
          max_y = y;
        }
      }
    }
    if (max > 0) {
      room.createConstructionSite(max_x, max_y, STRUCTURE_ROAD);
    }
  }
};

module.exports = actionBuildRoads;
