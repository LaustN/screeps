module.exports = function(creep){
  var collectFromDump = function(){
    if(creep.carry.energy != 0){
      return false;
    }

    var nearestContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: function(structure){
      if(structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY]>0){
        return true;
      }
    }});

    var nearestLink = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: function(structure){
      if((structure.structureType == STRUCTURE_LINK) && (structure.energy > 0) && (structure.memory.lastTransferTime != Game.time)){
        return true;
      }
    }});

    if (nearestContainer && nearestLink && creep.pos.getRangeTo(nearestContainer) < creep.pos.getRangeTo(nearestLink)) {
      if(nearestContainer.transfer(creep,RESOURCE_ENERGY) != OK){
        creep.moveTo(nearestContainer);
      }
      return true;
    }
    if (nearestLink) {
      var transferMessage = nearestLink.transferEnergy(creep, creep.carryCapacity);
      console.log(creep.name  +" is collecting from " + nearestLink.pos + " and got the response " + transferMessage );
      if(transferMessage != OK){
        creep.moveTo(nearestLink);
      }
      else {
        nearestLink.memory.lastTransferTime = Game.time;
      }
      return true;
    }
    if (nearestContainer) {
      if(nearestContainer.transfer(creep,RESOURCE_ENERGY) != OK){
        creep.moveTo(nearestContainer);
      }
      return true;
    }
    return false;
  };
  var dumpAtStorage = function(){
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

  if(!collectFromDump()){
    dumpAtStorage();
  }
  return true;
}
