module.exports = function (creep) {
  if (creep.carryCapacity == _.sum(creep.carry))
    return false;

  var droppedResourcesHere = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
  var nonFullContainersHere = creep.pos.findInRange(FIND_STRUCTURES,1,{filter:function(structure){
    if(structure.structureType == STRUCTURE_CONTAINER){
      if(_.sum(structure.store) < structure.storeCapacity){
        return true;
      }
    }
    return false;
  }});

  if ((droppedResourcesHere.length > 0) && (droppedResourcesHere[0].resourceType == RESOURCE_ENERGY)) {
    var pickupSizeLimit = creep.getActiveBodyparts(WORK) * 2;

    if(nonFullContainersHere.length>0){
      pickupSizeLimit = 100000; //ought to be int.max, don't know what that's called in js
    }

    var resourceToPickUp = _.find(droppedResourcesHere, function(resource){
      return (resource.amount<pickupSizeLimit);
    });
    if(resourceToPickUp){
      creep.pickup(resourceToPickUp);
    }
  }
  return false;
}
