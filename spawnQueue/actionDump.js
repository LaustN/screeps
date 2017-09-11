module.exports = function (creep) {
  if (creep.carry[RESOURCE_ENERGY] > 0) {
    console.log(creep.name + " dumping");
    var structuresHere = creep.pos.findInRange(FIND_STRUCTURES, 1);
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
