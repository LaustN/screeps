module.exports = function (creep) {
  //figure out how high walls need to be
  var desiredHitsPerWall = creep.room.controller.level * 500;
  if (creep.room.controller.level > 7) {
    desiredHitsPerWall = 300000000;
  }
  var target = Game.getObjectById(creep.memory.focus);
  if (target) {
    if (target.structureType) {
      if ((target.structureType != STRUCTURE_RAMPART) && (target.structureType != STRUCTURE_RAMPART)) {
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
  if (target) {
    creep.memory.focus = target.id;
    var repairMessage = creep.repair(target);
    if (repairMessage == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  }


  //find a rampart that needs strengthening
  // else find wall that needs strengthening
  console.log("actionFortify not implemented yet");
  return false;
}
