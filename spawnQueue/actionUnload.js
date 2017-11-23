module.exports = function (creep) {
  creep.memory.unloading = creep.memory.unloading || false;

  if (_.sum(creep.carry) == creep.carryCapacity) {
    creep.memory.unloading = true;
  }

  if (_.sum(creep.carry) == 0) {
    creep.memory.unloading = false;
  }

  if (creep.memory.unloading) {
    var target = Game.getObjectById(creep.memory.unloadfocus);
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
          //keep this target for a few tick regardless
          if (creep.memory.unloadAtLinkTick) {
            if ((Game.time - 10) < creep.memory.unloadAtLinkTick) {
              //stay here
            }
            else {
              delete creep.memory.unloadAtLinkTick;
              target = null;
            }
          }
          else {
            if (target.energy == target.energyCapacity)
              target = null;
          }
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
      var homeLinkId = null;
      var home = Game.getObjectById(creep.memory.home);
      if (home) {
        var homeLink = home.pos.findClosestByRange(FIND_MY_STRUCTURES, {
          filter: function (structure) {
            return structure.structureType == STRUCTURE_LINK;
          }
        });
        if (homeLink) {
          homeLinkId = homeLink.id;
        }
      }

      target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: function (structure) {
          if (structure.structureType == STRUCTURE_STORAGE)
            return true;
          if (
            (
              (structure.structureType == STRUCTURE_SPAWN)
              || (structure.structureType == STRUCTURE_EXTENSION)
              || (structure.structureType == STRUCTURE_LINK)
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
      target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function (structure) {
          if ((structure.structureType == STRUCTURE_CONTAINER) && (_.sum(structure.store) < structure.storeCapacity)) {
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
      creep.memory.unloadfocus = target.id;
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
      if (transferMessage == OK) {
        if (target.structureType == STRUCTURE_LINK) {
          creep.memory.unloadAtLinkTick = Game.time;
        }
      }
      return true;
    }

  }
  return false;
}
