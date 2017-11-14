module.exports = function (creep) {
  if (creep.carryCapacity == _.sum(creep.carry))
    return false;

  var droppedResourcesHere = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
  if ((droppedResourcesHere.length > 0) && (droppedResourcesHere[0].resourceType == RESOURCE_ENERGY)) {
    creep.pickup(droppedResourcesHere[0]);
    console.log(creep.name + " picking up energy at " + droppedResourcesHere[0].pos);
  }
  return false;
}
