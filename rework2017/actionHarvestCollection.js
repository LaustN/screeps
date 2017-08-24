module.exports = function (creep) {
  //creep.memory.focus is id of a source
  var source = Game.getObjectById(creep.memory.focus);
  if (creep.pos.getRangeTo(source) > 2) {
    creep.moveTo(source);
    return true;
  }

  var droppedEnergy = source.pos.findInRange(FIND_DROPPED_ENERGY, 1);
  if (droppedEnergy && droppedEnergy.length) {
    creep.moveTo(droppedEnergy[0]);
    creep.pickup(droppedEnergy[0]);
    return true;
  }

  var structuresWithStorage = source.pos.findInRange(FIND_STRUCTURES, 1, {
    filter: function (structure) {
      if (structure.store && structure.store[RESOURCE_ENERGY])
        return true;
    }
  });
  if (structuresWithStorage.length) {
    if (creep.withdraw(structuresWithStorage[0]) == ERR_NOT_IN_RANGE)
      creep.moveTo(structuresWithStorage[0]);
    return true;
  }

  var providingCreeps = source.pos.findInRange(FIND_MY_CREEPS, 1, {
    filter: function (energyProvidingCreep) {
      if (energyProvidingCreep.memory.energyWanted == -1)
        return false;
    }
  });
  if (providingCreeps && providingCreeps.length) {
    creep.moveTo(providingCreeps[0]);
    providingCreeps[0].transfer(creep, RESOURCE_ENERGY);
  }
}
