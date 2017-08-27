// module.exports = function() {
  StructureSpawn.prototype.acceptsWithdrawsFrom = function(roleName) {
    return false;
    return roleName !== 'hauler' && !require('utils').needMoreHarvesters(this);
  };

  Object.defineProperty(StructureSpawn.prototype, 'hasEnergy', {
    get: function() {
      return this.energy > 100;
    }
  });
// };
