module.exports = function(creep){
  if(_.sum(creep.carry) < creep.carryCapacity){
    var droppedEnergy  = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter:{resourceType: RESOURCE_ENERGY}});
    if(droppedEnergy){
      creep.memory.focus = droppedEnergy.id; //mainly for the graphics to update
      creep.moveTo(droppedEnergy);
      creep.pickup(droppedEnergy);
      return true;
    }
  }
  return false;
}
  