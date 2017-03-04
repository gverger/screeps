module.exports = function() {
  StructureSpawn.prototype.acceptsWithdrawsFrom = function(roleName) {
    if (this.isForHarvest) {
      return false;
    }
    return this.roleName !== 'hauler';
  };

  Object.defineProperty(StructureSpawn.prototype, 'hasEnergy', {
    get: function() {
      return this.energy > 0;
    }
  });
};
