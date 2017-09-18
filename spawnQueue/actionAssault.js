var checkAssaultTarget = require("checkAssaultTarget");

module.exports = function (creep) {
  var enemiesNearby = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
  var flag = Game.getObjectById(creep.memory.flag);
  var target = null;
  if (flag) {
    if (flag.pos.roomName != creep.pos.roomName) {
      creep.moveTo(flag);
      return true; //start by moving to the same room as the target flag
    }

    var sharedTarget = Game.getObjectById(creep.room.assaultTarget);
    if (checkAssaultTarget(sharedTarget, flag)) {
      target = sharedTarget;
    }


    if (!target) {
      var structuresAtTarget = flag.pos.look(LOOK_STRUCTURES);
      if (structuresAtTarget.length > 0) {
        console.log("structures at target:" + JSON.stringify(structuresAtTarget))
        target = structuresAtTarget[0];
      }
    }

    if (!target) {
      var creepTarget = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if(creepTarget){
        target = creepTarget;
      }
    }
    if (!target) {
      var towerTarget = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,{filter:function(structure){
        if(structure.structureType == STRUCTURE_TOWER)
          return true;
      }});
      if(towerTarget){
        target = towerTarget;
      }
    }

    if (!target) {
      var spawnTarget = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,{filter:function(structure){
        if(structure.structureType == STRUCTURE_SPAWN)
          return true;
      }});
      if(spawnTarget){
        target = spawnTarget;
      }
    }

    if (!target) {
      target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
    }

    if (target) {
      creep.room.assaultTarget = target.id;
      console.log(creep.name + " assaulting " + target);
      if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
        var moveResult = creep.moveTo(target);
        if (moveResult == ERR_NO_PATH) {
          creep.room.assaultTarget = null; //for the off chance that a target flees out of range inside a room
        }
      }
    }
  }



  if (target) {
    var targetRange = creep.pos.getRangeTo(target);
    if (targetRange > 3) {
      creep.moveTo(target);
    }
    if (targetRange < 3) {
      console.log(creep.name + " might move away?");
    }
    if (creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3).length > 1) {
      creep.rangedMassAttack();
    } else {
      creep.rangedAttack(target);
    }
    return true;
  } else {
    console.log(creep.name + " did not see enemies in " + creep.room.name);
  }
  return false;
}
