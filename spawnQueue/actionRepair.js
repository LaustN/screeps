var checkRepairTarget = function (structure) {
  if (structure) {
    if (structure.my) {
      if (structure.structureType == STRUCTURE_WALL)
        return false;
      if (structure.structureType == STRUCTURE_RAMPART)
        return false;
      return (structure.hits < structure.hitsMax);
    }
    else {
      if (structure.structureType) {
        switch (structure.structureType) {
          case STRUCTURE_ROAD:
          case STRUCTURE_CONTAINER:
            return (structure.hits < structure.hitsMax);
            break;
          default:
            return false;
        }
      }
    }
  }
  return false;
};

module.exports = function (creep) {
  if (creep.carry[RESOURCE_ENERGY] < 1)
    return false;

  var target = null;
  if (creep.memory.focus) {
    var existingTarget = Game.getObjectById(creep.memory.focus);
    if (checkRepairTarget(existingTarget)) {
      target = existingTarget;
    }
  }
  if (!target) {
    target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: function (structure) {
        return checkRepairTarget(structure);
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
  else {
    creep.memory.focus = null;
  }
  return false;
}
