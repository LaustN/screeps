module.exports = function (creep) {
  if (creep.carryCapacity == _.sum(creep.carry))
    return false;

  var droppedResourcesHere = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
  if ((droppedResourcesHere.length > 0) && (droppedResourcesHere[0].resourceType == RESOURCE_ENERGY)) {
    var pickupSizeLimit = creep.getActiveBodyparts(WORK) * 2;

    var resourceToPickUp = _.find(droppedResourcesHere, function(resource){
      return (resource.amount<pickupSizeLimit);
    });
    if(resourceToPickUp){
      creep.pickup(resourceToPickUp);
    }
  }
  return false;
}
