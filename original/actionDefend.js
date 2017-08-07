module.exports = function(creep){
  var actionAttackRanged = require("actionAttackRanged");

  var target = null;
  if (creep.memory.defendFlag) {
    var targetFlag = Game.flags[creep.memory.defendFlag];
    if(targetFlag && targetFlag.pos){
      if(creep.pos.roomName == targetFlag.pos.roomName ){
        creep.memory.hasBeenToDefendedRoom = true;
      }

      if(targetFlag.pos.roomName != creep.pos.roomName && !creep.memory.hasBeenToDefendedRoom){
        creep.moveTo(targetFlag);
        return true;
      }
      target = targetFlag.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    }
  }
  else {
    creep.memory.hasBeenToDefendedRoom = true;
    target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  }
  if(target) {
    return actionAttackRanged(creep,target);
  }

  if(!creep.memory.hasBeenToDefendedRoom){
    var targetFlag = Game.flags[creep.memory.defendFlag];
    if(targetFlag){
      creep.moveTo(targetFlag);
    }
    return true;

  }




}
