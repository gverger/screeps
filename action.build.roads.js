var actionBuildRoads = {
  buildRoads: function(room) {
    if (Memory.roads) {
      return null;
    }
    var source = room.controller.pos.findClosestByRange(room.find(FIND_SOURCES));
    if (source != null) {
      path = room.controller.pos.findPathTo(source.pos, { ignoreCreeps: true });
      for (i = 0; i < path.length; i++) {
        step = path[i];
        room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
        if (step.dx == 1 || step.dx == -1) {
          room.createConstructionSite(step.x, step.y + 1, STRUCTURE_ROAD);
          room.createConstructionSite(step.x, step.y - 1, STRUCTURE_ROAD);
        }
        if (step.dy == 1 || step.dy == -1) {
          room.createConstructionSite(step.x + 1, step.y, STRUCTURE_ROAD);
          room.createConstructionSite(step.x - 1, step.y, STRUCTURE_ROAD);
        }
      };
      Memory.roads = true;
    }
  }
};

module.exports = actionBuildRoads;
