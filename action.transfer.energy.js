var utils = require("utils");
var actionTransferEnergy = {
  transfer: function(creep, filter) {
    var structures = utils.structuresNeedingEnergy(creep.room);
    if (filter)
      structures = _.filter(structures, filter);
    if (structures != "") {
      var s = creep.pos.findClosestByPath(structures);
      creep.say(s.pos.x + " " + s.pos.y);
      if(creep.transfer(s, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(s);
      }
    }
  }
};

module.exports = actionTransferEnergy;
