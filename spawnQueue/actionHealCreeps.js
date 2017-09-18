module.exports = function(creep){
  var wounded = creep.pos.findClosestByRange(FIND_MY_CREEPS,{filter: function(woundedCreep){
    if(woundedCreep.hits < woundedCreep.hitsMax)
      return true;
    return false;
  }});
  if(wounded){
    console.log(creep.name + " healing " + wounded.name);
    creep.moveTo(wounded);
    if(creep.pos.isNearTo(wounded))
      creep.heal(wounded);
    else
      creep.rangedHeal(wounded);
    return true;
  }
  return false;
}
  