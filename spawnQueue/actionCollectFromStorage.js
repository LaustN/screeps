module.exports = function (creep) {
  var structureWithStorage = source.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: function (structure) {
      if ((structure.storeCapacity > 0) && (structure.store[RESOURCE_ENERGY] > creep.carryCapacity))
        return true;
      return false;
    }
  });
  if (structureWithStorage == null) {
    structureWithStorage = source.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: function (structure) {
        if ((structure.storeCapacity > 0) && (structure.store[RESOURCE_ENERGY] > 0))
          return true;
        return false;
      }
    });
  }
  if (structureWithStorage != null) {
    if (creep.withdraw(structureWithStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
        creep.moveTo(structureWithStorage);
    }
    return true;
  }
  return false; 
}
