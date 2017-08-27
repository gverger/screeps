// module.exports = function() {
  Room.prototype.structuresWithEnergy = function() {
    if (this.__structuresWithEnergyComputedTime !== Game.time) {
      this.__structuresWithEnergyComputedTime = Game.time;
      this.__structuresWithEnergy = this.find(FIND_STRUCTURES, {
        filter: (s) => { return s.hasEnergy; }
      });
    }
    return this.__structuresWithEnergy;
  };

  Room.prototype.structuresToHarvest = function(roleName) {
    let structures = this.structuresWithEnergy();
    return _.filter(structures, function(s) {
      return s.acceptsWithdrawsFrom(roleName);
    });
  };

  Object.defineProperty(Room.prototype, 'harvestOnly', {
    get: function() {
      return this.memory.harvestOnlyMode;
    },

    set: function(value) {
      this.memory.harvestOnlyMode = value;
    }
  });

Room.prototype.timeToUpgradeController = function() {
  let level = this.controller.level;
  let maxNbOfExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][level];
  return this.nbOfExtensions() == maxNbOfExtensions;
};

Room.prototype.nbOfExtensions = function() {
  let extensions =
    this.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION });
  return extensions.length;
};
// };
