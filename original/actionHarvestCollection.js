module.exports = function(creep){

  //check that creep is not full
  //find workers that are less than 100% AND next to a harvest source
  //move to closest of those
  //transfer resources
  if(creep.carryCapacity == creep.carry.energy){
    return false;
  }
  
  var harvestingCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter : function(filterCreep){
    if(filterCreep.memory.role == "harvester" && filterCreep.carry.energy / filterCreep.carryCapacity > 0.5 ){
      return true;
    }
    return false;
  }});

  if(!harvestingCreep){
    console.log(creep.name + " failed to find a creep to collect energy from");
    return false;
  }

  if(harvestingCreep.transferEnergy(creep) != OK){
    creep.moveTo(harvestingCreep);
  }
}
