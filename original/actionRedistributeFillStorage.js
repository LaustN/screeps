module.exports = function(creep){
  var collectFromDump = function(){
    creep.say("CoDu");

    if(creep.carry.energy != 0){
      return false;
    }

    var nearestContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: function(structure){
      if(structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY]>0){
        return true;
      }
    }});

    var nearestLink = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: function(structure){
      if(structure.structureType == STRUCTURE_LINK && structure.energy>0){
        return true;
      }
    }});

    if (nearestContainer && nearestLink && creep.pos.getRangeTo(nearestContainer) < creep.pos.getRangeTo(nearestLink)) {
      console.log("Collecting at " + nearestContainer.pos);
      if(nearestContainer.transfer(creep,RESOURCE_ENERGY) != OK){
        creep.moveTo(nearestContainer);
      }
      return true;
    }
    if (nearestLink) {
      console.log("Collecting at " + nearestLink.pos);
      if(nearestLink.transferEnergy(creep) != OK){
        creep.moveTo(nearestLink);
      }
      return true;
    }
    if (nearestContainer) {
      console.log("Fallback Collecting at " + nearestContainer.pos);
      if(nearestContainer.transfer(creep,RESOURCE_ENERGY) != OK){
        creep.moveTo(nearestContainer);
      }
      return true;
    }
    creep.say("FSE!")
    return false;
  };
  var dumpAtStorage = function(){
    creep.say("DuSt");

    var storage = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,{filter: function(structure){
        if(structure.structureType == STRUCTURE_STORAGE && (_.sum(structure.store) < structure.storeCapacity)){
          return true;
        }
        return false;
      }});
    console.log("Dumping at " + storage.pos);
    if(creep.transfer(storage, RESOURCE_ENERGY) != OK){
      creep.moveTo(storage);
    }
  }

  if(!collectFromDump()){
    dumpAtStorage();
  }
  return true;
}
