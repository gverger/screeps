module.exports = function() {
  StructureExtension.prototype.acceptsWithdrawsFrom = function(roleName) {
    if (this.isForHarvest) {
      return false;
    }
    return this.roleName !== 'hauler';
  };

  Object.defineProperty(StructureExtension.prototype, 'hasEnergy', {
    get: function() {
      return this.energy > 0;
    }
  });
};
