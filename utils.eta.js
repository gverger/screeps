var eta = {
  /**
   * @param {Creep} creep
   * @param {RoomPosition} destination
   **/
  timeToDestination: function(creep, destination) {
    path = creep.pos.findPathTo(destination);
    weight = this.weight(creep);
    nbOfMoves = this.nbOfMoves(creep);
    room = creep.room;
    time = 0;
    for (step of path) {
      terrain = room.lookForAt(LOOK_TERRAIN, step.x, step.y);
      isRoad = room.lookForAt(LOOK_STRUCTURES, step.x, step.y).some(
          (s) => { return s.structureType == 'road'}
          );
      if (isRoad) {
        terrain = "road";
      }
      terrainMultiplier = this.terrainMult(terrain);
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
    sum = creep.body.reduce( function(sum, bodyPart) {
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
  },

  test: function() {
    creep = Game.creeps['Cooper'];
    if (!creep)
      console.log('NO CREEP');
    console.log(this.weight(creep));
    console.log(this.nbOfMoves(creep));
  }
};

module.exports = eta;
