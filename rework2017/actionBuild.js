module.exports = function (creep) {
  if (creep.carry[RESOURCE_ENERGY] > 0) {
    var target = null;
    if (creep.memory.focus) {
      var existingTarget = Game.getObjectById(creep.memory.focus);
      if (existingTarget && existingTarget.progressTotal) {
        target = existingTarget;
      }
    }
    if (!target) {
      target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES,{filter: function(constructionsite){
        return(( constructionsite.structureType != STRUCTURE_WALL) && (constructionsite.structureType != STRUCTURE_RAMPART));
      }});
    }
    if (target && target.progressTotal) {
      creep.memory.focus = target.id;
      if (target.pos.getRangeTo(creep) <= 3) {
        creep.build(target);
      } else {
        creep.moveTo(target);
      }
      return true;
    }
  }
  return false;
}
