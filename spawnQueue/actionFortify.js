module.exports = function (creep) {
  //figure out how high walls need to be
  var desiredHitsPerWall = creep.room.controller.level * 10000;
  if (creep.room.controller.level > 7) {
    desiredHitsPerWall = 300000000;
  }
  var target = Game.getObjectById(creep.memory.focus);
  if (target) {
    if (target.structureType) {
      if ((target.structureType != STRUCTURE_RAMPART) && (target.structureType != STRUCTURE_RAMPART)) {
        target = null;
      }
      if (target && (target.hits >= desiredHitsPerWall)) {
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
    console.log("fortifier repair message:" + repairMessage);
    if(repairMessage == ERR_INVALID_TARGET){
      var repairMessage = creep.build(target);
    }
    if (repairMessage == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
    return true;
  }
  return false;
}
