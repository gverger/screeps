module.exports = function() {
  StructureSpawn.prototype.acceptsWithdrawsFrom = function(roleName) {
    if (this.isForHarvest) {
      return roleName == 'hauler';
    }
    return true;
  };

  Object.defineProperty(StructureSpawn.prototype, 'hasEnergy', {
    get: function() {
      return this.energy > 0;
    }
  });
};
