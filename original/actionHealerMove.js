module.exports = function(creep){
  if(creep.memory.assault){
    var targetFlag = Game.flags[creep.memory.assault];
    if(targetFlag && targetFlag.pos){
      if(targetFlag.pos.roomName != creep.pos.roomName){
        creep.moveTo(targetFlag);
        return true;
      }

      var closestCombatCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS,{filter: function(filteredCreep){ return (filteredCreep.getActiveBodyparts(ATTACK) + filteredCreep.getActiveBodyparts(RANGED_ATTACK)) > 0;  }});
      if(closestCombatCreep){
        creep.moveTo(closestCombatCreep);
        return true;
      }
    }
  }
  return false;
}
