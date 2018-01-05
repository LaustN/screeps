module.exports = function (creep) {
  creep.memory.focus = null;

  if(creep.carry[RESOURCE_ENERGY] > 0){
    return false;
  }

  if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY]) {
    if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.storage);
    }
    return true;
  }

  var containerWithEnergy = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: function (structure) {
      if (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY])
        return true;

      if (structure.structureType == STRUCTURE_LINK && structure.energy)
        return true;

      return false;
    }
  });

  if (containerWithEnergy) {
    if (creep.withdraw(containerWithEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(containerWithEnergy);
    }
    return true;
  }

  var energyProvidingCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: function(energyProvidingCreep){
    if( (energyProvidingCreep.memory.energyWanted == -1) && _.sum(energyProvidingCreep.carry) == energyProvidingCreep.carryCapacity )
      return true;
  }});

  if(energyProvidingCreep){
    var transferResult = energyProvidingCreep.transfer(creep, RESOURCE_ENERGY)
    if(transferResult == ERR_NOT_IN_RANGE)
      creep.moveTo(energyProvidingCreep);
  }

  return false;
}
