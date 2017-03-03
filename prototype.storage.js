module.exports = function() {
  StructureStorage.prototype.acceptsWithdrawsFrom = function(roleName) {
    if (this.isForHarvest) {
      return roleName == 'hauler';
    }
    return true;
  };
  Object.defineProperty(StructureStorage.prototype, 'hasEnergy', {
    get: function() {
      return this.store[RESOURCE_ENERGY] > 0;
    }
  });
};
