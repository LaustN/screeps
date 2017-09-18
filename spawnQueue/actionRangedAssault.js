var checkAssaultTarget = require("checkAssaultTarget");

module.exports = function (creep) {
  var enemiesNearby = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
  var flag = Game.flags[creep.memory.flag];
  var target = null;
  if (flag) {
    if (flag.pos.roomName != creep.pos.roomName) {
      creep.moveTo(flag);
      return true; //start by moving to the same room as the target flag
    }

    var sharedTarget = Game.getObjectById(creep.room.assaultTarget);
    if (checkAssaultTarget(sharedTarget, flag)) {
      target = sharedTarget;
      console.log("shared target is " + JSON.stringify(target));
    }

    if (!target) {
      var structuresAtTarget = flag.pos.lookFor(LOOK_STRUCTURES);
      if (structuresAtTarget.length > 0 && (!structuresAtTarget[0].my)) {
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
      if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
        var moveResult = creep.moveTo(target);
        if (moveResult == ERR_NO_PATH) {
          creep.room.assaultTarget = null; //for the off chance that a target flees out of range inside a room
        }
        return true;
      }
    }
  }
  return false;
}
