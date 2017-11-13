module.exports = function (creep) {
  if (creep.room.controller && creep.room.controller.my) {
    creep.memory.isDemolishing = false;
  }

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
      if (existingTarget && !existingTarget.my && existingTarget.structureType) {
        target = existingTarget;
      }
    }
    if (!target) {
      target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function (structure) {
          return ((structure.structureType != STRUCTURE_CONTROLLER) && (structure.structureType != STRUCTURE_CONTAINER)) && !structure.my;
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
