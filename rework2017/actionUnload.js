module.exports = function (creep) {
  creep.memory.unloading = creep.memory.unloading || false;

  if (_.sum(creep.carry) == creep.carryCapacity) {
    creep.memory.unloading = true;
  }

  if (_.sum(creep.carry) == 0) {
    creep.memory.unloading = false;
  }

  if (creep.memory.unloading) {
    var target = Game.getObjectById(creep.memory.focus);
    switch (target.structureType) {
      case STRUCTURE_EXTENSION:
        if (target.energy == target.energyCapacity)
          target = null;
        break;
      case STRUCTURE_SPAWN:
        if (target.energy == target.energyCapacity)
          target = null;
        break;
      case STRUCTURE_STORAGE:
        //do nothing, assume that storage has capacity
        break;
      default:
        target = null; //ocus must be legacy, so null it
        break;
    }
    if (!target) {
      if (creep.room.storage) {
        target = creep.room.storage;
      }
    }
    if (!target) {
      target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_SPAWN }});
    }
    if(target){
      var transferMessage = creep.transfer(target, RESOURCE_ENERGY);
      if(transferMessage == ERR_NOT_IN_RANGE)
        creep.moveTo(target);
      return true;
    }
  }
  return false;
}
