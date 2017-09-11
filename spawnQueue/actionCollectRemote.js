module.exports = function (creep) {
  //Did consider finding a non-closest container, but things are going to storage rather than closest container anyhow
  var containerFilter = function (structure) {
    if ((structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] > 0))
      return true;
    if ((structure.structureType == STRUCTURE_LINK) && (structure.energy > 0))
      return true;
    return false;
  };

  if (creep.carry[RESOURCE_ENERGY] == 0) {
    var target = null;
    if (creep.memory.focus) {
      var existingTarget = Game.getObjectById(creep.memory.focus);
      if (existingTarget && existingTarget.store && existingTarget.store[RESOURCE_ENERGY] > 0) {
        target = existingTarget;
      } else {
        target = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: containerFilter });
      }

      if (target && target.store[RESOURCE_ENERGY] > 0) {
        creep.memory.focus = target.id;

        if (target.pos.getRangeTo(creep) <= 1) {
          creep.withdraw(target, RESOURCE_ENERGY);
        } else {
          creep.moveTo(target);
        }
        return true;
      }
    }
  }
  return false;
}
