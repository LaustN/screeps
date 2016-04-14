module.exports = function(creep){
  var woundedCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter:
    function(filteredCreep){
        return filteredCreep.hits < filteredCreep.hitsMax;
    }});
  if(woundedCreep){
    creep.heal(woundedCreep);
  }
}
