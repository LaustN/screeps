var checkDemolishTarget = function (target) {
  if (target) {
    if(target.room.controller){
      if(target.room.controller.my){
        return false;
      }
    }
    if (target.my)
      return false;

    if (target.structureType) {
      switch (target.structureType) {
        case STRUCTURE_WALL:
        case STRUCTURE_ROAD:
        case STRUCTURE_RAMPART:
          return true;
        default:
          return false;
      }
    }
  }
  return false;
};

module.exports = function (creep) {
  if ((typeof(creep.room.controller) != "undefined") && creep.room.controller.my) {
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
      if (checkDemolishTarget(existingTarget)) {
        target = existingTarget;
      }
    }
    if (!target) {
      target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function (structure) {
          return checkDemolishTarget(structure);
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
