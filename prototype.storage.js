// module.exports = function() {
  StructureStorage.prototype.acceptsWithdrawsFrom = function(roleName) {
    return roleName != 'hauler';
  };
  Object.defineProperty(StructureStorage.prototype, 'hasEnergy', {
    get: function() {
      return this.store[RESOURCE_ENERGY] > 0;
    }
  });
// };
