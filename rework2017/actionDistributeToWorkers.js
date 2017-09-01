module.exports = function (creep) {
  if (creep.carry[RESOURCE_ENERGY] > 0) {
    var target = Game.getObjectById(creep.memory.focus);
    if (target) {

      if ((typeof(target.memory) == "undefined") ||(typeof(target.memory.energyWanted) == "undefined") || (target.memory.energyWanted < 0)) {
        target = null;
      }
      else{
        console.log(target.name + " is a hungry worker!");
      }
    }

    if (!target) {
      var hungryCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: function (filterCreep) {
          return (filterCreep.memory.energyWanted > 0) && ((filterCreep.carry[RESOURCE_ENERGY] / filterCreep.carryCapacity) < 0.5);
        }
      });

      if (hungryCreep) {
        target = hungryCreep;
      }
      else {
        var spendingCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
          filter: function (filterCreep) {
            return (filterCreep.memory.energyWanted > 0);
          }
        });
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
