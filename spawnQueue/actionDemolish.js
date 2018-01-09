var checkDemolishTarget = function (target) {
  if (target) {
    if (target.my)
      return false;

    if (target.structureType) {
      switch (target.structureType) {
        case STRUCTURE_WALL:
        case STRUCTURE_ROAD:
        case STRUCTURE_CONTAINER:
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
    creep.say("a");
    var target = null;
    if (creep.memory.focus) {
      var existingTarget = Game.getObjectById(creep.memory.focus);
      if (checkDemolishTarget(existingTarget)) {
        target = existingTarget;
        creep.say("b");
      }
    }
    if (!target) {
      target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function (structure) {
          return checkDemolishTarget(structure);
        }
      });
      creep.say("c");

    }
    if (target) {
      creep.memory.focus = target.id;
      if (target.pos.isNearTo(creep)) {
        creep.dismantle(target);
        creep.say("d");

      } else {
        creep.moveTo(target);
        creep.say("e");
      }

      return true;
    }
  }
  creep.say("f");
  return false;
}
