module.exports = function (creep) {
  if (creep.carry[RESOURCE_ENERGY] > 0) {
    var destination = Game.getObjectById(creep.memory.focus);

    if (destination && (
      !destination.energyCapacity
      || !((destination.energyCapacity - destination.energy) > 0)
      || !destination.my)
    ) {
      destination = null;
      creep.memory.focus = null;
    }

    if (!destination) {
      var unfilledExtension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: function (structure) {
          if (!(structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN))
            return false;
          if (structure.energyCapacity == structure.energy)
            return false;
          return true;
        }
      });

      if (unfilledExtension) {
        destination = unfilledExtension;
        creep.memory.focus = destination.id;
      }
    }

    if (!destination) {
      var unfilledWithCapacity = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: function (structure) {
          if (structure.structureType == STRUCTURE_LINK)
            return false;
          if (!structure.energyCapacity)
            return false;
          if (structure.energyCapacity == structure.energy)
            return false;
          return true;
        }
      });

      if (unfilledWithCapacity) {
        destination = unfilledWithCapacity;
        creep.memory.focus = destination.id;
      }
    }

    if (destination) {
      if (creep.transfer(destination, RESOURCE_ENERGY) != OK) {
        creep.moveTo(destination);
      }
      var otherDistributersHere = creep.pos.findInRange(FIND_MY_CREEPS, 1, {
        filter: function (otherDistributer) {
          return (otherDistributer.memory.energyWanted == 0)
            && ((otherDistributer.carry[RESOURCE_ENERGY] / otherDistributer.carryCapacity) > (creep.carry[RESOURCE_ENERGY] / creep.carryCapacity))
            && otherDistributer.id != creep.id; //do not count yourself as an extra feeded
        }
      });
      if (otherDistributersHere.length) {
        creep.transfer(otherDistributersHere[0], RESOURCE_ENERGY);
        creep.say("->" + otherDistributersHere[0].name);
        creep.memory.focus = null;
      }
      return true;
    }
  }
  return false;
}
