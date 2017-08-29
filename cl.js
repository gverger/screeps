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
