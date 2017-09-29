var checkAssaultTarget = require("checkAssaultTarget");

module.exports = function (creep) {
  var flag = Game.flags[creep.memory.flag];
  var target = null;

  var sharedTarget = Game.getObjectById(creep.room.assaultTarget);
  if (checkAssaultTarget(sharedTarget, flag)) {
    target = sharedTarget;
    console.log("shared target is " + JSON.stringify(target));
  }

  if ((!target) && (flag.pos.roomName != creep.pos.roomName) ) {
    var creepTarget = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (creepTarget) {
      target = creepTarget;
    }
  }

  if (flag && !target) {
    if (flag.pos.roomName != creep.pos.roomName) {
      creep.moveTo(flag);
      return true; //start by moving to the same room as the target flag
    }

    if (!target) {
      var structuresAtTarget = flag.pos.lookFor(LOOK_STRUCTURES);
      if (structuresAtTarget.length > 0 && (!structuresAtTarget[0].my)) {
        target = structuresAtTarget[0];
      }
    }
  }

  if (!target) {
    var creepTarget = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (creepTarget) {
      target = creepTarget;
    }
  }

  if (!target) {
    var towerTarget = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
      filter: function (structure) {
        if (structure.structureType == STRUCTURE_TOWER)
          return true;
      }
    });
    if (towerTarget) {
      target = towerTarget;
    }
  }

  if (!target) {
    var spawnTarget = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
      filter: function (structure) {
        if (structure.structureType == STRUCTURE_SPAWN)
          return true;
      }
    });
    if (spawnTarget) {
      target = spawnTarget;
    }
  }

  if (!target) {
    target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
  }

  if(creep.room.controller &&( !creep.room.controller.my)   ){
    if(creep.room.controller.safeMode > 0){
      console.log("Not defending in " + creep.room.name + " since safeMode is active");
      return null;
    }
  }


  return target;
}
