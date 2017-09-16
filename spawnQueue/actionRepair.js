module.exports = function (creep) {
  if(creep.carry[RESOURCE_ENERGY]<1)
    return false;
  
  var target = null;
  if (creep.memory.focus) {
    var existingTarget = Game.getObjectById(creep.memory.focus);
    if (existingTarget
      && (existingTarget.structureType != STRUCTURE_WALL)
      && (existingTarget.structureType != STRUCTURE_RAMPART)
      && (existingTarget.hits < existingTarget.hitsMax)) {
      target = existingTarget;
    }
  }
  if (!target) {
    target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: function (structure) {
        if (
          (structure.structureType != STRUCTURE_WALL)
          && (structure.structureType != STRUCTURE_RAMPART)
          && (structure.hits < structure.hitsMax)
        ) {
          return true;
        }
        return false;
      }
    });
  }
  if (target) {
    creep.memory.focus = target.id;
    if (target.pos.getRangeTo(creep) <= 3) {
      creep.repair(target);
    } else {
      creep.moveTo(target);
    }
    return true;
  }
  else{
    creep.memory.focus = null;
  }
  return false;
}
