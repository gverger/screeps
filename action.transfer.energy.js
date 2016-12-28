var utils = require("utils");
var actionTransferEnergy = {
  transfer: function(creep, structureTypes = undefined) {
    var structures = utils.structuresNeedingEnergy(creep.room);
    if (structureTypes)
      structures = _.filter(structures, (s) => structureTypes.includes(s.structureType));
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
