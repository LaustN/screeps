module.exports = function (creep) {
  if (creep.carryCapacity == _.sum(creep.carry))
    return false;

  var focusObject = Game.getObjectById(creep.memory.focus);

  if (focusObject) {
    var harvestMessage = creep.harvest(focusObject);
    if (harvestMessage != OK) {
      if (!creep.pos.isNearTo(focusObject)) {
        creep.moveTo(focusObject);
        return true;
      }
    }

    var droppedResourcesHere = creep.pos.look(LOOK_RESOURCES);
    if(droppedResourcesHere.length > 0 && droppedResourcesHere[0].resourceType == RESOURCE_ENERGY)
      creep.pickup(droppedResourcesHere[0]);
    return true;
  }
  return false;
}
