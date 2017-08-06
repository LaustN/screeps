module.exports = function(creep){
  if(creep.carry.energy == 0){
    creep.memory.dropOff = false;
    creep.memory.dropOffWaitStart = 0;
  }
  else if(creep.carry.energy == creep.carryCapacity){
    creep.memory.dropOff = true;
    creep.memory.dropOffWaitStart = 0;
  }
  else {
    if(!creep.memory.dropOffWaitStart){
      creep.memory.dropOffWaitStart = Game.time;
    }
    if ((creep.memory.dropOffWaitStart + 50) < Game.time) {
      //waited 50 ticks for a load, so drop whatever we have
      creep.memory.dropOffWaitStart = 0;
      creep.memory.dropOff = true;
    }
  }

  if(creep.memory.dropOff == true){
    var dropOff = Game.getObjectById(creep.memory.dropOffId);
    if (dropOff) {
      if(dropOff.energy && dropOff.energyCapacity == dropOff.energy){
        dropOff = null;
      }
    }

    if (dropOff) {
      if(typeof(dropOff.storeCapacity) != "undefined" && dropOff.storeCapacity > 0 && _.sum(dropOff.store) == dropOff.storeCapacity) {
        dropOff = null;
      }
    }

    if(!dropOff) {
      dropOff = creep.pos.findClosestByRange(FIND_STRUCTURES,{
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

      if (dropOff) {
        creep.memory.dropOffId = dropOff.id;
      }
    }

    if (!dropOff) {
      dropOff = Game.getObjectById(creep.memory.home);
    }

    if(dropOff) {
      var dropOffResult = creep.transfer(dropOff, RESOURCE_ENERGY);
      if(dropOffResult == ERR_FULL){
        creep.drop(RESOURCE_ENERGY);
      }
      if(dropOffResult ==ERR_NOT_IN_RANGE) {
        creep.moveTo(dropOff);
      }
      if(dropOffResult == OK){
        creep.memory.dropOffId = null;
      }

      return true;
    }
    else {
      if(creep.room.controller){
        var rangeToController = creep.pos.getRangeTo(creep.room.controller.pos);
        if(rangeToController < 2){
          creep.drop(RESOURCE_ENERGY);
        }
        else{
          creep.moveTo(creep.room.controller);}
      }
    }
  }
  return false;
}
