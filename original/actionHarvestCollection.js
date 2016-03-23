module.exports = function(creep){

  //check that creep is not full
  //find workers that are less than 100% AND next to a harvest source
  //move to closest of those
  //transfer resources
  if(creep.carryCapacity == creep.carry.energy){
    return false;
  }

  var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
  if(target) {
      if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
      }
      console.log("Scavenging!");
      return true;
  }

  var harvestingCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter : function(filterCreep){
    if(filterCreep.memory.role == "harvest" && creep.carry.energy / creep.carryCapacity > 0.5 ){
      return true;
    }
    return false;
  }});

  if(harvestingCreep.transferEnergy(creep) != OK){
    creep.moveTo(harvestingCreep);
  }
}
