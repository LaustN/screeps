module.exports = function (creep) {
  if (creep.carry[RESOURCE_ENERGY] > 0) {
    var target = Game.getObjectById(creep.memory.focus);
    if (target) {
      if ((typeof (target.memory) == "undefined")
        || (typeof (target.memory.energyWanted) == "undefined")
        || (target.memory.energyWanted < 0)
      ) {
        target = null;
      }
    }

    if (target) {
      var feeders = target.pos.findInRange(FIND_MY_CREEPS, 2, {
        filter: function (feeder) {
          return (feeder.memory.energyWanted < 0)
            && ((feeder.carry[RESOURCE_ENERGY] / feeder.carryCapacity) > 0.5)
            && feeder.id != creep.id; //do not count yourself as an extra feeded
        }
      });

      if (feeders.length > 0) {
        creep.say("too much noise here!");
        target = null;
      }
      else{
        creep.say("->" + target.name);
      }
    }

    if (!target) {
      var hungryCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: function (filterCreep) {
          var hunger = (filterCreep.memory.energyWanted > 0) && ((filterCreep.carry[RESOURCE_ENERGY] / filterCreep.carryCapacity) < 0.2);
          return hunger;
        }
      });

      if (hungryCreep) {
        target = hungryCreep;
      }
      else {
        target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
          filter: function (filterCreep) {
            return (filterCreep.memory.energyWanted > 0);
          }
        });
      }
    }

    if (target && (target.carry[RESOURCE_ENERGY] / target.carryCapacity) > 0.5) {
      //target is more than half full, consider secondary targets
      var secondaries = target.pos.findInRange(FIND_MY_CREEPS, 2, {
        filter: function (secondary) {
          return (secondary.memory.energyWanted > 0)
            && ((secondary.carry[RESOURCE_ENERGY] / secondary.carryCapacity) < 0.5)
        }
      });

      if (secondaries.length) {
        target = secondaries[0];
      }
    }

    if (target) {
      creep.memory.focus = target.id;
      if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
      return true;
    }
  }
  return false;
}
