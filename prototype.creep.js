module.exports = function() {
  Object.defineProperty(Creep.prototype, 'nativeRoom', {
    get: function() {
      return Game.rooms[this.memory.roomName];
    }
  });
};
