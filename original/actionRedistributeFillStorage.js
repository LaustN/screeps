module.exports = function(creep){
  var collectFromDump = function(){

    var nearestContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: function(structure){
      if(structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY]>100){
        return true;
      }
    }});

    var nearestLink = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: function(structure){
      if((structure.structureType == STRUCTURE_LINK) && (structure.energy > 100) ){
        return true;
      }
    }});
    if (nearestContainer && nearestLink && creep.pos.getRangeTo(nearestContainer) < creep.pos.getRangeTo(nearestLink) && !Memory.workingLinks[nearestLink.id]) {
      if(nearestContainer.transfer(creep,RESOURCE_ENERGY) ==  ERR_NOT_IN_RANGE){
        creep.moveTo(nearestContainer);
      }
      creep.memory.refillingStorage = true;
      return true;
    }

    if(nearestLink || nearestContainer ){
      creep.memory.refillingStorage = true;
    }

    if(creep.carry.energy != 0){
      return false;
    }

    if (nearestLink) {
      var transferMessage = creep.withdraw(nearestLink,RESOURCE_ENERGY);
      if(transferMessage ==  ERR_NOT_IN_RANGE){
        creep.moveTo(nearestLink);
      }
      Memory.workingLinks[nearestLink.id] = true;
      return true;
    }
    if (nearestContainer) {
      if(nearestContainer.transfer(creep,RESOURCE_ENERGY) ==  ERR_NOT_IN_RANGE){
        creep.moveTo(nearestContainer);
      }
      return true;
    }
    creep.memory.refillingStorage = false;

    return false;
  };

  var dumpAtStorage = function(){
    if(creep.carry.energy == 0){
      return false;
    }
    if(!creep.memory.refillingStorage){
      return false;
    }

    var storage = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,{filter: function(structure){
        if(structure.structureType == STRUCTURE_STORAGE && (_.sum(structure.store) < structure.storeCapacity)){
          return true;
        }
        return false;
      }});
    if(creep.transfer(storage, RESOURCE_ENERGY) != OK){
      creep.moveTo(storage);
    }
  }

  if(collectFromDump()){
    return true;
  }
  if(dumpAtStorage()) {
    return true;
  }
  return false;

}
