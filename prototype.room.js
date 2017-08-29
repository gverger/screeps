Room.prototype.structuresNeedingEnergy = function() {
  if (!this.__structuresNeedingEnergy) {
    var structureEnergyTypes =
      [STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_EXTENSION, STRUCTURE_LINK];
    var structureStorageTypes = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE];

    this.__structuresNeedingEnergy = this.find(FIND_STRUCTURES, {
      filter: (s) => {
        return (structureEnergyTypes.includes(s.structureType) && s.energy < s.energyCapacity) ||
          (structureStorageTypes.includes(s.structureType) &&
            s.store[RESOURCE_ENERGY] < s.storeCapacity);
      }
    });
  }
  return this.__structuresNeedingEnergy;
};

Room.prototype.harvestedSources = function() {
  return this.find(FIND_SOURCES, { filter: {  hasAssociatedContainer: true } });
};

Room.prototype.sources = function() {
  if (!this._sources) {
    if (!this.memory.sourceIds) {
      const sources = this.find(FIND_SOURCES);
      this.memory.sourceIds = _(sources).map('id');
    }
    this._sources = _(this.memory.sourceIds).map(id => { return Game.getObjectById(id); });
  }
  return this._sources;
}

Room.prototype.creeps = function() {
  if(!this._creeps) {
    this._creeps = _(Game.creeps).filter({memory: {roomName: this.name}});
  }
  return this._creeps;
}

Room.prototype.structuresWithEnergy = function() {
  if (!this._structuresWithEnergy) {
    this._structuresWithEnergy = this.find(FIND_STRUCTURES, {
      filter: (s) => { return s.hasEnergy; }
    });
  }
  return this._structuresWithEnergy;
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

Room.prototype.needMoreHarvesters = function() {
  if (this._needMoreHarvesters === undefined) {
    let harvesters = this.creeps().filter({memory: {role: 'harvester'}});
    let nbWorkParts = harvesters.filter(function(h) {
      // let timeToMoveToCurrentDestination = eta.timeToDestination(h, spawn.pos);
      let timeToSpawn = h.body.length * 3;
      return timeToSpawn < h.ticksToLive;
    }).map('body').flatten().reduce(function(sum, p) {
      if (p.type == 'work') {
        return sum + 1;
      }
      return sum;
    }, 0);
    let nbSources = this.sources().length;
    let maxHarvesters = _(this.sources()).sum(s => { return s.nbOfHarvestingSlots(); });
    this._needMoreHarvesters = nbWorkParts < nbSources * 5 && harvesters.size() < maxHarvesters;
  }
  return this._needMoreHarvesters;
};

Room.prototype.log = function(message) {
  console.log("[" + this.name + "] " + message);
};
