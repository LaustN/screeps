var checkDemolishTarget = function (target) {
  if (target) {
    if (target.my && target.room.controller && target.room.controller.my)
      return false;

    if (target.structureType) {
      switch (target.structureType) {
        case STRUCTURE_WALL:
        case STRUCTURE_ROAD:
        case STRUCTURE_CONTAINER:
        case STRUCTURE_CONTROLLER:
          return false;
          break;
        default:
          return true;
          break;
      }
    }
  }
  return false;
};

module.exports = function (creep) {
  if (_.sum(creep.carry) == creep.carryCapacity) {
    creep.memory.isDemolishing = false;
  }

  if (creep.carry[RESOURCE_ENERGY] == 0) {
    creep.memory.isDemolishing = true;
  }

  if (creep.memory.isDemolishing) {
    var target = null;
    if (creep.memory.focus) {
      var existingTarget = Game.getObjectById(creep.memory.focus);
      if (checkDemolishTarget(existingTarget)) {
        target = existingTarget;
      }
    }
    if (!target) {
      target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function (structure) {
          if (checkDemolishTarget(structure)) {
            //do not choose a crowded structure for demolishment
            return (structure.pos.findInRange(FIND_MY_CREEPS, 1).length < 2);
          };
          return false;
        }
      });
    }
    if (target) {
      creep.memory.focus = target.id;
      if (target.pos.isNearTo(creep)) {
        creep.dismantle(target);
      } else {
        creep.moveTo(target);
      }

      return true;
    }
  }
  return false;
}
