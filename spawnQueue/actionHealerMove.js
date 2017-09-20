module.exports = function(creep){
  var destinationCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter:function(myBattleCreep){
    return (myBattleCreep.getActiveBodyparts(HEAL) + myBattleCreep.getActiveBodyparts(ATTACK) + myBattleCreep.getActiveBodyparts(RANGED_ATTACK) );
  }});
  if(destinationCreep){
    creep.moveTo(destinationCreep);
    return true;
  }

  return false;
}
  