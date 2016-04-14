module.exports = function(creep){
  if(creep.carry.energy == 0) {
    creep.memory.collectingEnergy = true;
  }

  if(creep.carry.energy == creep.carryCapacity) {
    creep.memory.collectingEnergy = false;
  }

  if(creep.memory.collectingEnergy) {

    var focusObject = null;
    for (var flagName in Game.flags) {
      var flag = Game.flags[flagName];
      if(flag.name == creep.memory.focus){
        focusObject = flag;
        break;
      }
    }
    if(focusObject){
      if(creep.pos.roomName != focusObject.pos.roomName){
        var moveMessage = creep.moveTo(focusObject);
        creep.say(moveMessage);
        return true;
      }

      var home = Game.getObjectById(creep.memory.home);

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

      //getting all the way down here means that we did not find any local energy, so drop what we have at home
      if(creep.energy > 0){
        creep.memory.dropoff = true;
      }
    }
  }
}
