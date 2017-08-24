module.exports = function(creep){
  if(_.sum(creep.carry) < creep.carryCapacity){
    var droppedEnergy  = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
    if(droppedEnergy){
      creep.moveTo(droppedEnergy);
      creep.pickup(droppedEnergy);
      return true;
    }
  }
  return false;
}
  