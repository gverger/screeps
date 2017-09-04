var roleAttacker = {
  updateStatus: function(creep) {
    let prey = this.prey(creep);
    if (!prey || !prey.body.some(s => { return s.type == ATTACK || s.type == RANGED_ATTACK; })) {
      prey = undefined;
    }

    if (creep.memory.status != 'searching' && !prey) {
      creep.memory.status = 'searching';
    }
    else if (creep.memory.status != 'attacking' && prey) {
      creep.memory.status = 'attacking';
    }
  },

  prey: function(creep) {
    if (!creep.memory.preyId)
      return undefined;
    let prey = Game.getObjectById(creep.memory.preyId);
    return prey;
  },

  run: function(creep) {
    creep.heal(creep);
    this.updateStatus(creep);

    if (creep.memory.status == 'attacking') {
      this.attacking(creep);
    }
    else if (creep.memory.status == 'searching') {
      this.searching(creep);
    }
  },

  /**
   * @param {Creep} creep
   **/
  attacking: function(creep) {
    let prey = Game.getObjectById(creep.memory.preyId);
    if (!prey) {
      return;
    }

    let attacked = creep.rangedAttack(prey);
    if (attacked == ERR_NOT_IN_RANGE) {
      creep.moveTo(prey);
      return;
    }
    attacked = creep.attack(creep);
    if (attacked == ERR_NOT_IN_RANGE) {
      creep.moveTo(prey);
      return;
    }
  },

  /**
   * @param {Creep} creep
   **/
  searching: function(creep) {
    let flag = _.find(Game.flags, { name: creep.memory.flagName });
    if (!flag) {
      return;
    }
    if (!flag.room || creep.room.name != flag.room.name) {
      creep.moveTo(flag, {reusePath: 50});
      return;
    }
    let hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
      filter: s => {
        return creep.body.some(function(part) {
          return part.type == ATTACK || part.type == RANGED_ATTACK
        });
      }
    } );
    if (!hostile) {
      hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    }
    if (!hostile) {
      creep.moveTo(flag, {reusePath: 50});
      return;
    }
    if (hostile) {
      creep.memory.preyId = hostile.id;
      this.attacking(creep);
    }
  },

};

module.exports = roleAttacker;

