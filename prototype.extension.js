// module.exports = function() {
  StructureExtension.prototype.acceptsWithdrawsFrom = function(roleName) {
    return false;
    if (this.isForHarvest) {
      return false;
    }
    return roleName !== 'hauler';
  };

  Object.defineProperty(StructureExtension.prototype, 'hasEnergy', {
    get: function() {
      return this.energy > 0;
    }
  });
// };
