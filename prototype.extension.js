module.exports = function() {
  StructureExtension.prototype.acceptsWithdrawsFrom = function(roleName) {
    if (this.isForHarvest) {
      return roleName == 'hauler';
    }
    return true;
  };

  Object.defineProperty(StructureExtension.prototype, 'hasEnergy', {
    get: function() {
      return this.energy > 0;
    }
  });
};
