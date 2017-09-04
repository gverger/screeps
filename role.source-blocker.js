var sourceBlocker = {
  run: function(creep) {
    let flag = _.find(Game.flags, { name: creep.memory.flagName });
    if (!flag) {
      return;
    }
    if (!flag.room || creep.room.name != flag.room.name) {
      creep.moveTo(flag, {reusePath: 50});
      return;
    }
    if (creep.pos.findInRange(FIND_SOURCES, 1).length > 0) {
      return;
    }

    let sources = creep.room.find(FIND_SOURCES);
    _.each(sources, function(s) {
      let error = creep.moveTo(s);
      if (error != ERR_NO_PATH) {
        return;
      }});
  }
}

module.exports = sourceBlocker;
