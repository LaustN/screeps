module.exports = function (creep) {
  if(creep.carry.energy == 0){
    return false;
  }
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
  }
