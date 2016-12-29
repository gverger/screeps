var eta = {
  /**
   * @param {Creep} creep
   * @param {RoomPosition} destination
   **/
  timeToDestination: function(creep, destination) {
    var path = creep.pos.findPathTo(destination);
    var weight = this.weight(creep);
    var nbOfMoves = this.nbOfMoves(creep);
    var room = creep.room;
    var time = 0;
    for (let step of path) {
      var terrain = room.lookForAt(LOOK_TERRAIN, step.x, step.y)[0];
      var isRoad = room.lookForAt(LOOK_STRUCTURES, step.x, step.y).some(
          (s) => { return s.structureType == 'road'}
          );
      if (isRoad) {
        terrain = "road";
      }
      var terrainMultiplier = this.terrainMult(terrain);
      time += Math.ceil(terrainMultiplier * weight / nbOfMoves)
    }
    return time;
  },

  /* @param {String} terrain */
  terrainMult: function(terrain) {
    switch (terrain) {
      case "road":
        return 0.5;
      case "plain":
        return 1;
      case "swamp":
        return 5;
      default:
        return 0;
    }
  },

  /* @param {Creep} creep
   * @return {Number}
   * */
  weight: function(creep) {
    var energy = creep.carry.energy;
    var sum = creep.body.reduce( function(sum, bodyPart) {
      if (bodyPart.type == MOVE || (bodyPart.type == CARRY && energy <= 0)) {
        return sum
      }
      energy -= 50;
      return sum + 1;
    }, 0);
    return sum;
  },

  /* @param {Creep} creep
   * @return {Number}
   * */
  nbOfMoves: function(creep) {
    return creep.body.reduce( function(sum, bodyPart) {
      if (bodyPart.type == MOVE) {
        return sum + 1
      }
      return sum;
    }, 0);
  }
};

module.exports = eta;
