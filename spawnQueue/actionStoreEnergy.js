module.exports = function (creep) {
  if (creep.carry[RESOURCE_ENERGY] > 0) {
    var dumpPoint = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: function (structure) { //roads are also structures, so the filter is actually neeeded!
        if (structure.structureType == STRUCTURE_CONTAINER){
          if(_.sum(structure.store) < structure.storeCapacity)
            return true;
        }
        return false;
      }
    });
    if (dumpPoint) {
      if(creep.transfer(dumpPoint, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        creep.moveTo(dumpPoint);
      return true;
    }
    creep.drop(RESOURCE_ENERGY);
    return true;
  }
  return false;
}
