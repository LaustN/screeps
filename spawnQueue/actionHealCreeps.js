module.exports = function(creep){
  var wounded = creep.pos.findClosestByRange(FIND_MY_CREEPS,function(woundedCreep){
    if(woundedCreep.hits < woundedCreep.hitsMax)
      return true;
    return false;
  });
  if(wounded){
    creep.moveTo(wounded)
    if(creep.isNearTo(wounded))
      creep.heal(wounded);
    else
      creep.rangedHeal(wounded);
    return true;
  }
  return false;
}
  