var utils = require('utils');

var actionBuildRoads = {
  /**
   * @param {RoomObject} room
   **/
  buildRoads: function(room) {
    if (Game.time % 100 != 0) {
      return null;
    }
    var sources = room.find(FIND_SOURCES);
    for (let source of sources) {
      this.buildTheRoad(room, room.controller.pos, source.pos);
      var spawn = utils.spawnOfRoom(room);
      this.buildTheRoad(room, spawn.pos, source.pos);
    }
    this.buildRoadsAroundExtensions(room);
  },

  buildTheRoad: function(room, pos1, pos2) {
    var path = pos1.findPathTo(pos2, { ignoreCreeps: true, ignoreRoads: true });
    for (i = 0; i < path.length; i++) {
      var step = path[i];
      room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
    };
  },

  buildRoadsAroundExtensions: function(room) {
    let structureTypes = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN];
    let extensions = room.find(FIND_MY_STRUCTURES,
        { filter: (s) => { return structureTypes.includes(s.structureType); } });
    let positions = _(extensions).map(function(extension) {
      /** @type {RoomPosition} pos */
      let pos = extension.pos;
      return [
        new RoomPosition(pos.x, pos.y + 1, pos.roomName),
        new RoomPosition(pos.x, pos.y - 1, pos.roomName),
        new RoomPosition(pos.x + 1, pos.y, pos.roomName),
        new RoomPosition(pos.x - 1, pos.y, pos.roomName)
      ];
    }).flatten().value();
    _.each(positions, function(position) {
      let structures = room.lookForAt('structure', position);
      if (_.all(structures, function(s) {
        return !OBSTACLE_OBJECT_TYPES.includes(s.structureType);
      })) {
        room.createConstructionSite(position.x, position.y, STRUCTURE_ROAD);
      }
    });
  }
};

module.exports = actionBuildRoads;
