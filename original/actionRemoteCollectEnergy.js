module.exports = function(creep){
  if(creep.carry.energy == 0) {
    creep.memory.collectingEnergy = true;
  }

  if(creep.carry.energy == creep.carryCapacity) {
    creep.memory.collectingEnergy = false;
  }

  if(creep.memory.collectingEnergy) {

    var focusObject = Game.flags[creep.memory.focus];

    if(focusObject){
      if(creep.pos.roomName != focusObject.pos.roomName){
        var moveMessage = creep.moveTo(focusObject);
        return true;
      }

      var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
      if(target) {
        if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
        creep.say("RTS" + (target.pos.x - creep.pos.x) + ";" + (target.pos.y - creep.pos.y));
        return true;
      }

      if(localUnloadingScout){
        if(localUnloadingScout.transfer(creep, RESOURCE_ENERGY)!=OK){
          creep.moveTo(localUnloadingScout);
        }
        return true;
      }
      if(creep.carryCapacity > 0 && creep.carry[RESOURCE_ENERGY] > 0 && creep.memory.dropoff && creep.memory.role == "scout"){
        return true;
      }

      var localEnergyStorage = creep.pos.findClosestByRange(FIND_STRUCTURES,{filter : function(structure){
        if(structure && structure.store && structure.store[RESOURCE_ENERGY] && structure.store[RESOURCE_ENERGY] > 0 && structure.structureType != "spawn"){
          return true;
        }
        return false;
      }});

      if(localEnergyStorage){
        creep.moveTo(localEnergyStorage);
        localEnergyStorage.transfer(creep,RESOURCE_ENERGY);
        return true;
      }

      localEnergyStorage = creep.pos.findClosestByRange(FIND_STRUCTURES,{filter : function(structure){
        if(structure && structure.energy > 0 && structure.structureType && structure.structureType != "spawn"){
          return true;
        }
        return false;
      }});

      if(localEnergyStorage){
        if(localEnergyStorage.transferEnergy(creep)!=OK){
          creep.moveTo(localEnergyStorage);
        }
        return true;
      }

      localUnloadingScout = creep.pos.findClosestByRange(FIND_MY_CREEPS,{filter : function(creep){
        return false;
      }});


      //getting all the way down here means that we did not find any local energy, so drop what we have at home
      if(creep.carry[RESOURCE_ENERGY] > 0){
        console.log(creep.name + " failed to find something to pick up while carrying " + creep.energy);
        creep.memory.collectingEnergy = false;
        creep.memory.dropoff = true;
        return true;
      }

      creep.moveTo(focusObject);
      return true;
    }
  }
}
