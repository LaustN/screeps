module.exports = function (creep) {
  var structuresWithStorage = source.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: function (structure) {
      if ((structure.storeCapacity > 0) && (structure.store[RESOURCE_ENERGY] > 0))
        return true;
      return false;
    }
  });
  if (structuresWithStorage.length > 0) {
    if (creep.withdraw(structuresWithStorage[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
        creep.moveTo(structuresWithStorage[0]);
    }
    return true;
  }
  return false; 
}
