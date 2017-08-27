module.exports = {
  suicideAll: function() {
    for (let name in Game.creeps) {
      let creep = Game.creeps[name];
      creep.suicide();
    }
  },

  whatNext: function() {
    return require('action.spawn').whatNext(this.spawn);
  },

  room: Game.rooms.W22S94,
  spawn: Game.spawns.Spawn1
};
