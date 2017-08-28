/**
 * Claimers
 * memory.flagName set on
 **/
var claimer = {
  /**
   * @param {Creep} creep
   **/
  updateStatus: function(creep) {
    creep.memory.status = 'claiming';
  },
  /**
   * @param {Creep} creep
   **/
  run: function(creep) {
    this.updateStatus(creep);
    if (creep.memory.status === 'claiming') {
      return this.claiming(creep);
    }
  },

  /**
   * @param {Creep} creep
   **/
  claiming: function(creep) {
    let flag = _.find(Game.flags, { name: creep.memory.flagName });
    if (!flag) return;
    if (creep.pos.isNearTo(flag)) {
      let controller = creep.room.controller
      creep.claimController(controller);
      return;
    }
    creep.moveTo(flag, {reusePath: 50});
  }
}

module.exports = claimer;

