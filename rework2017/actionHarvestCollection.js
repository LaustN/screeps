module.exports = function (creep) {
  //creep.memory.focus is id of a source
  var source = Game.getObjectById(creep.memory.focus);
  if (creep.pos.getRangeTo(source) > 5) {
    creep.moveTo(source);
    return true;
  }

  var isMoving = false;

  var droppedEnergy = source.pos.findInRange(FIND_DROPPED_RESOURCES, 1, { filter: { resourceType: RESOURCE_ENERGY } });
  if (droppedEnergy && droppedEnergy.length) {
    if (creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
      //only return from scavenging if movement was needed
      creep.moveTo(droppedEnergy[0]);
      isMoving = true;
    }
  }

  var structuresWithStorage = source.pos.findInRange(FIND_STRUCTURES, 1, {
    filter: function (structure) {
      if ((structure.storeCapacity > 0) && (structure.store[RESOURCE_ENERGY] > 0))
        return true;
      return false;
    }
  });
  if (structuresWithStorage.length > 0) {
    if (creep.withdraw(structuresWithStorage[0]) == ERR_NOT_IN_RANGE && !isMoving)
      creep.moveTo(structuresWithStorage[0]);
    return true;
  }

  var providingCreeps = source.pos.findInRange(FIND_MY_CREEPS, 1, {
    filter: function (energyProvidingCreep) {
      if (energyProvidingCreep.memory.energyWanted == -1)
        return true;
      return false;
    }
  });
  if (providingCreeps && providingCreeps.length) {
    var transferMessage = providingCreeps[0].transfer(creep, RESOURCE_ENERGY);
    if(transferMessage == ERR_NOT_IN_RANGE && !isMoving){
      creep.moveTo(providingCreeps[0]);
    }
  }
}
