// module.exports = function() {
  StructureSpawn.prototype.acceptsWithdrawsFrom = function(roleName) {
    if (roleName === 'hauler') {
      return false;
    }
    return !this.room.needMoreHarvesters();
  };

  Object.defineProperty(StructureSpawn.prototype, 'hasEnergy', {
    get: function() {
      return this.energy > 100;
    }
  });
// };
