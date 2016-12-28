var utils = require("utils");
var defend = {
  /**
   * @param {Room} room
   **/
  defend: function(room) {
    this.safeMode(room);
  },

  /**
   * @param {Room} room
   **/
  safeMode: function(room) {
    /**
     * @type {StructureController} controller
     **/
    var controller = room.controller;
    if (controller.safeMode ||
        controller.safeModeAvailable == 0 ||
        room.find(FIND_HOSTILE_CREEPS).length == 0)
      return;

    var spawn =  utils.spawnOfRoom(room);
    if( spawn.hits < spawn.hitsMax ||
        _(room.find(FIND_MY_CREEPS, { filter: (s) => s.room == room })).some((c) => { c.hits < c.hitsMax })) {
      console.log("SAFE MODE!");
      controller.activateSafeMode();
    }
  }

};

module.exports = defend;
