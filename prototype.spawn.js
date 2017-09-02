// module.exports = function() {
  StructureSpawn.prototype.acceptsWithdrawsFrom = function(roleName) {
    if (roleName === 'hauler') {
      return false;
    }
    return this.room.controller.level < 5 && !this.room.needMoreHarvesters();
  };

  Object.defineProperty(StructureSpawn.prototype, 'hasEnergy', {
    get: function() {
      return this.energy > 100;
    }
  });
// };
