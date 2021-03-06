module.exports = function(creep){
  var profiler = require("profiler")(creep.name);
  if(creep.carry.energy == 0){
    creep.memory.dropoff = false;
  }
  if(creep.carry.energy == creep.carryCapacity){
    creep.memory.dropoff = true;
  }

  if(creep.memory.dropoff == true){
    var home = Game.getObjectById(creep.memory.home);
    if(creep.pos.roomName != home.pos.roomName) {
      creep.moveTo(home, {reusePath: 30});
      return true;
    }

    var dropoff = null;

    if (creep.memory.dropoffId) {
      dropOff = Game.getObjectById(creep.memory.dropoffId)
    }

    if(!dropoff){
      dropoff = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,{
        filter: function(structure){
          if (typeof(structure.energy) != "undefined" && structure.energyCapacity > structure.energy && structure.isActive()) {
            return true;

          };
          if(typeof(structure.storeCapacity) != "undefined" && structure.storeCapacity > 0 && _.sum(structure.store) < structure.storeCapacity) {
            return true;
          }
          return false;
        }
      });
    }

    if(!dropoff){
      dropoff = creep.pos.findClosestByRange(FIND_STRUCTURES,{
        filter: function(structure){
          if(typeof(structure.storeCapacity) != "undefined" && structure.storeCapacity > 0 && _.sum(structure.store) < structure.storeCapacity) {
            return true;
          }
          return false;
        }
      });
    }

    if (!dropoff) {
      dropoff = Game.getObjectById(creep.memory.home);
    }

    if(dropoff)
    {
      creep.memory.dropoffId = dropoff.id;
      var transferMessage = creep.transfer(dropoff, RESOURCE_ENERGY);
      if(transferMessage == ERR_NOT_IN_RANGE || transferMessage == ERR_TIRED){
        creep.moveTo(dropoff, {reusePath: 30});
      }
      else {
        creep.memory.dropoffId = null;
      }
    }
    return true;
  }
}
