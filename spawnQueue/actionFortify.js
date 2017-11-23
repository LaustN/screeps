module.exports = function (creep) {
  if((!creep.room.controller) || !creep.room.controller.my )
    return false; //do not maintain wall where I have no controllers
  if (creep.carry[RESOURCE_ENERGY] < 1)
    return false;

  //figure out how high walls need to be
  var desiredHitsPerWall = creep.room.controller.level * 10000;
  
  /**
   *  this seems to break in a fairly bad way, making fortifiers ignore ramparts untill current focus wall is maxed out
   */
  // if (creep.room.controller.level > 7) {
  //   desiredHitsPerWall = 300000000;
  // }


  var target = Game.getObjectById(creep.memory.focus);
  if (target) {
    if (target.structureType) {
      if ((target.structureType != STRUCTURE_RAMPART) && (target.structureType != STRUCTURE_RAMPART)) {
        target = null;
      }
      if (target && ((target.hits >= (desiredHitsPerWall + 3000)) || (target.hits == 300000000))) {
        target = null;
      }
    }
    else {
      target = null;
    }
  }

  if (!target) {
    target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
      filter: function (structure) {
        if (structure.structureType != STRUCTURE_RAMPART)
          return false;
        if (structure.hits < desiredHitsPerWall)
          return true;
        return false;
      }
    });
  }
  if (!target) {
    target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: function (structure) {
        if (structure.structureType != STRUCTURE_WALL)
          return false;
        if (structure.hits < desiredHitsPerWall)
          return true;
        return false;
      }
    });
  }
  if (!target) {

    var target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {
      filter: function (constructionsite) {
        if (constructionsite.structureType == STRUCTURE_RAMPART)
          return true;
        if (constructionsite.structureType == STRUCTURE_WALL)
          return true;
        return false;
      }
    });
  }

  if (target) {

    creep.memory.focus = target.id;
    var repairMessage = creep.repair(target);
    if (repairMessage == ERR_INVALID_TARGET) {
      repairMessage = creep.build(target);
    }
    if (repairMessage == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
    return true;
  }
  return false;
}
