module.exports = function (creep) {
  if (creep.carry[RESOURCE_ENERGY] > 0) {
    var structuresHere = creep.pos.findInRange(FIND_STRUCTURES, 3, {
      filter: function (structure) { //roads are also structures, so the filter is actually neeeded!
        if (structure.structureType == STRUCTURE_CONTAINER){
          if(_.sum(structure.store) < structure.storeCapacity)
            return true;
        }
        if (structure.structureType == STRUCTURE_LINK)
          return true;
        return false;
      }
    });
    if (structuresHere.length > 0) {
      if(creep.transfer(structuresHere[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        creep.moveTo(structuresHere[0]);
      return true;
    }
    creep.drop(RESOURCE_ENERGY);
    return true;
  }
  return false;
}
