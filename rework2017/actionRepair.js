module.exports = function (creep) {
  console.log("repair was called for " + creep.name);
  var target = null;
  if (creep.memory.focus) {
    var existingTarget = Game.getObjectById(creep.memory.focus);
    if (existingTarget && (existingTarget.hits < existingTarget.hitsMax)) {
      target = existingTarget;
      console.log("reusing repair target");
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
          console.log("structure at " + structure.pos + " is an ok repair target");
          return true;
        }
        console.log("structure at " + structure.pos + " is not an ok repair target");
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
  return false;
}
