module.exports = function (creep) {
  if(creep.carry[RESOURCE_ENERGY] == 0){
    creep.memory.building = false;
  }
  if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity){
    creep.memory.building = true;
  }
  if(creep.memory.building){
    var target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES,{
      filter:function(constructionSite){
        return constructionSite.structureType != STRUCTURE_ROAD
      }});
    if(target == null){
      target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
    }
    if(target != null) {
      creep.memory.dropoff = false;
      var buildMessage = creep.build(target);
      if( buildMessage == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
      return true;
    }
    else {
      creep.building = false;
      return false;
    }
  }
}
