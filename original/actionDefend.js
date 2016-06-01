module.exports = function(creep){
  var actionAttackRanged = require("actionAttackRanged");

  var target = null;
  if (creep.memory.defendFlag) {
    var targetFlag = Game.flags[creep.memory.defendFlag];
    if(targetFlag && targetFlag.pos){
      target = targetFlag.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    }
  }
  else {
    target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  }
  if(target) {
    return actionAttackRanged(creep,target);
  }




}
