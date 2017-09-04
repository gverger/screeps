global.extensionsNeeded = function() {
  let rooms = _(Game.spawns).map("room");
  rooms = rooms.filter(function(room) {
    let maxNbOfExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];
    let nbOfExtensions = room.nbOfExtensions();
    let nbOfPendingExtensions = room.find(FIND_CONSTRUCTION_SITES, {filter: {structureType: STRUCTURE_EXTENSION}}).length;
    return nbOfExtensions + nbOfPendingExtensions < maxNbOfExtensions;
  });
  return rooms.map("name");
}

global.log = function() {
  console.log(_(arguments).map(object => {
    if ("string" == typeof object) {
      return object;
    }
    return JSON.stringify(object);
  }).join(" "));
}

module.exports = {
  suicideAll: function() {
    for (let name in Game.creeps) {
      let creep = Game.creeps[name];
      creep.suicide();
    }
  },

  suicideFromRoom: function(roomName) {
    _(Game.creeps).filter({memory: {roomName: roomName}}).each(c => {c.suicide();});
  },

  whatNext: function() {
    return require('action.spawn').whatNext(this.spawn);
  },

  room: Game.rooms.W22S94,
  spawn: Game.spawns.Spawn1
};
