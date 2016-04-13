module.exports = function(creep){
  if(creep.carry.energy == 0) {
    creep.memory.collectingEnergy = true;
  }

  if(creep.carry.energy == creep.carryCapacity) {
    creep.memory.collectingEnergy = false;
  }

  if(creep.memory.collectingEnergy) {

    var focusObject = Game.getObjectById(creep.memory.focus);
    if(creep.pos.roomName != focusObject.pos.roomName){
      creep.say("Moving out!");
      creep.moveTo(focusObject);
      return true;
    }

    var home = Game.getObjectById(creep.memory.home);

    var localEnergyStorage = creep.pos.findClosestByRange(FIND_STRUCTURES,{filter : function(structure){
      if(structure && structure.store && structure.store[RESOURCE_ENERGY] && structure.store[RESOURCE_ENERGY] > 0 ){
        return true;
      }
      return false;
    }});

    if(localEnergyStorage){
      creep.moveTo(localEnergyStorage);
      localEnergyStorage.transfer(creep,RESOURCE_ENERGY);
      return true;
    }
  }
}
