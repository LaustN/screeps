module.exports = function(creep){
  var woundedCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter:
    function(filteredCreep){
        return filteredCreep.hits < filteredCreep.hitsMax;
    }});
  if(woundedCreep){
    if(woundedCreep.pos.getRangeTo(creep) > 1){
      creep.rangedHeal(woundedCreep);
    }
    else {
      creep.heal(woundedCreep);
    }
  }
}
