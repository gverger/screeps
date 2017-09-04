/**
 * Flags should be:
 *  - placed on a remote source with memory.role = 'remote-miner'
 *  - placed on a remote controller with memory.role = 'claimer'
 **/

let prototype = Flag.prototype;

prototype.needCreep = function(role, spawn) {
  return this.memory.role == role && this.memory.spawnName == spawn.name;
}

prototype.hasAssignedCreep = function() {
  return this.memory.assignedCreepName;
}

prototype.assignCreep = function() {
  let unassignedCreep = _.find(Game.creeps, c => { return c.memory.role == this.memory.role && !c.memory.flagName; });
  if (!unassignedCreep) {
    return;
  }
  console.log("Assigning " + unassignedCreep.name + " to "+ this.name);
  unassignedCreep.memory.flagName = this.name;
  this.memory.assignedCreepName = unassignedCreep.name;
  console.log("Assign : " + this.memory.assignedCreepName);
}

prototype.run = function() {
  // Check the assigned creep is still alive
  let creepName = this.memory.assignedCreepName;
  if (!creepName) {
    this.assignCreep();
    return;
  }
  let creep = Game.creeps[creepName];
  if (creep && creep.memory.role == this.memory.role && creep.memory.flagName == this.name) {
    return;
  }
  console.log("Deleting memory");
  delete this.memory['assignedCreepName'];
}
