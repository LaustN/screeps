module.exports = function (creep) {
  if (creep.carry[RESOURCE_ENERGY] > 0) {
    console.log(creep.name + " dumping");
    var structuresHere = creep.pos.findInRange(FIND_STRUCTURES, 1, {
      filter: function (structure) { //roads are also structures, so the filter is actually neeeded!
        if (structure.structureType == STRUCTURE_CONTAINER)
          return true;
        if (structure.structureType == STRUCTURE_LINK)
          return true;
        return false;
      }
    });
    if (structuresHere.length > 0) {
      console.log(creep.name + " transfering to structure");
      creep.transfer(structuresHere[0], RESOURCE_ENERGY);
      return true;
    }
    creep.drop(RESOURCE_ENERGY);
    return true;
  }
  return false;
}
