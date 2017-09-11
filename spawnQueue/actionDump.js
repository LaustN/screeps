module.exports = function (creep) {
  if (creep.carry[RESOURCE_ENERGY] > 0) {
    var structuresHere = creep.pos.findInRange(FIND_STRUCTURES, 1);
    if (structuresHere && structuresHere.length) {
      creep.transfer(structuresHere[0], RESOURCE_ENERGY);
      return true;
    }
    creep.drop(RESOURCE_ENERGY);
    return true;
  }
  return false;
}
