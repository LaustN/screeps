module.exports = function(creep){
  if(creep.carry[RESOURCE_ENERGY] > 0){
    var destination = Game.getObjectById(creep.memory.focus);

    if(destination && (!destination.energyCapacity  || !((destination.energyCapacity - destination.energy)>0) )) {
      destination = null;
      creep.memory.focus = null;
    }

    if(!destination){
      var unfilledExtension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,{filter: function(structure){
        if(!(structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN))
          return false;
        if(structure.energyCapacity == structure.energy)
          return false;
        return true;
      }});

      if(unfilledExtension){
        destination = unfilledExtension;
        creep.memory.focus = destination.id;
      }
    }

    if(!destination){
      var unfilledWithCapacity = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,{filter: function(structure){
        if(!structure.energyCapacity)
          return false;
        if(structure.energyCapacity == structure.energy)
          return false;
        return true;
      }});

      if(unfilledWithCapacity){
        destination = unfilledWithCapacity;
        creep.memory.focus = destination.id;
      }
    }

    if(destination){
      if(creep.transfer(destination, RESOURCE_ENERGY)!=OK){
        creep.moveTo(destination);
      }
      return true;
    }
  }
  return false;
}
  