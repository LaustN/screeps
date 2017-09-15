module.exports = function (creep) {
  var containerFilter = function (structure) {
    if ((structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] > 0))
      return true;
    return false;
  };

  if (creep.carry[RESOURCE_ENERGY] == 0) {
    var homeLink = null;
    if (creep.room.storage) {
      homeLink = creep.room.storage.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_LINK } });
    }

    var target = null;
    if (creep.memory.focus) {
      var existingTarget = Game.getObjectById(creep.memory.focus);
      if (existingTarget && ((existingTarget.store && (existingTarget.store[RESOURCE_ENERGY] > 0)) || (existingTarget.energy > 0))) {
        target = existingTarget;
        console.log(creep.name + " reusing collection target");
      } else {
        if (homeLink && (homeLink.energy > 0)) {
          target = homeLink;
          console.log(creep.name + " selecting homelink");
        }
        else {
          target = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: containerFilter });
          console.log(creep.name + " finding a container");
        }
      }
    }
    if (target && ((target.store && target.store[RESOURCE_ENERGY] > 0) || target.energy > 0)) {
      creep.memory.focus = target.id;

      if (target.pos.getRangeTo(creep) <= 1) {
        creep.withdraw(target, RESOURCE_ENERGY);
      } else {
        creep.moveTo(target);
      }
      return true;
    }

  }
  return false;
}
