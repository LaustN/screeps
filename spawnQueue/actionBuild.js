module.exports = function (creep) {
  creep.say("build")
  if(creep.carry[RESOURCE_ENERGY] < 1){
    return false;
  }
  var target = null;
  if (creep.memory.focus) {
    var existingTarget = Game.getObjectById(creep.memory.focus);
    if (existingTarget && existingTarget.progressTotal) {
      target = existingTarget;
      console.log("reusing build target");
    }
  }
  if (!target) {
    target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
      filter: function (constructionsite) {
        return ((constructionsite.structureType != STRUCTURE_WALL) && (constructionsite.structureType != STRUCTURE_RAMPART));
      }
    });
  }
  if (target && (target.progressTotal) > 0){
    creep.memory.focus = target.id;
    if (target.pos.getRangeTo(creep) <= 3) {
      creep.build(target);
    } else {
      creep.moveTo(target);
    }
    return true;
  }
  return false;
}
