module.exports = function (creep) {
  creep.memory.unloading = creep.memory.unloading || false;

  if (_.sum(creep.carry) == creep.carryCapacity) {
    creep.memory.unloading = true;
  }

  if (_.sum(creep.carry) == 0) {
    creep.memory.unloading = false;
  }

  if (creep.memory.unloading) {
    var target = Game.getObjectById(creep.memory.focus);
    if (target) {
      switch (target.structureType) {
        case STRUCTURE_EXTENSION:
          if (target.energy == target.energyCapacity)
            target = null;
          break;
        case STRUCTURE_SPAWN:
          if (target.energy == target.energyCapacity)
            target = null;
          break;
        case STRUCTURE_LINK:
          if (target.energy == target.energyCapacity)
            target = null;
          break;
        case STRUCTURE_STORAGE:
          //do nothing, assume that storage has capacity
          break;
        default:
          target = null; //ocus must be legacy, so null it
          break;
      }
    }
    if (!target) {
      var homeLinkId = "";
      var home = Game.getObjectById(creep.memory.home);
      if(home){
        var homeLink = home.pos.findClosestByRange(FIND_MY_STRUCTURES, {
          filter: function (structure) {
            return structure.structureType == STRUCTURE_SPAWN;
          }
        });
        if(homeLink){
          homeLinkId = homeLink.id;
        }
      }

      target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: function (structure) {
          if (
            (structure.structureType == STRUCTURE_SPAWN
              || structure.structureType == STRUCTURE_EXTENSION
            )
            && (structure.energyCapacity > structure.energy)
            && (structure.id != homeLinkId)            
          )
            return true;
          return false;
        }
      });
    }

    if (!target) {
      if (creep.room.storage) {
        target = creep.room.storage;
      }
    }
    if (!target) {
      target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function (structure) {
          if (structure.structureType == STRUCTURE_CONTAINER && (_.sum(structure.store) < structure.storeCapacity)) {
            if (structure.pos.findInRange(FIND_SOURCES, 1).length == 0)
              return true;
          }
          return false;
        }
      });
    }
    if (!target) {
      if (creep.room.storage) {
        target = creep.room.storage;
      }
    }
    if (target) {
      var transferMessage = creep.transfer(target, RESOURCE_ENERGY);
      if (transferMessage == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
      return true;
    }
    if (!target) {
      target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: function (hungrycreep) {
          if ((hungrycreep.memory.energyWanted > 0) && _.sum(hungrycreep.carry) < hungrycreep.carryCapacity)
            return true;
          return false;
        }
      });
    }
    if (target) {
      var transferMessage = creep.transfer(target, RESOURCE_ENERGY);
      if (transferMessage == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
      return true;
    }

  }
  return false;
}
