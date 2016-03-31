module.exports = function(creep){

  //check that creep is not full
  //find workers that are less than 100% AND next to a harvest source
  //move to closest of those
  //transfer resources
  if(creep.carryCapacity == creep.carry.energy){
    return false;
  }

  var findFullHavestingCreep = function(fullness){
    var focusObject = Game.getObjectById(creep.memory.focus);
    if (!focusObject) {
      focusObject = Game.creeps[creep.memory.focus];
    }
    if (!focusObject) {
      focusObject = creep;
    }

    var harvestingCreep =
    focusObject.pos.findClosestByRange(FIND_MY_CREEPS,
      { filter : function(filterCreep){
        if(filterCreep.memory.role == "harvester"
            && filterCreep.carry.energy / filterCreep.carryCapacity >= fullness
          ){
          return true;
        }
        return false;
      }
    });
    return harvestingCreep
  }

  var wantedFullness = 1;
  var harvestingCreep = null;
  while (wantedFullness >= 0  && harvestingCreep == null) {
    harvestingCreep = findFullHavestingCreep(wantedFullness);
    wantedFullness-= 0.25;
  }


  if(!harvestingCreep){
    console.log(creep.name + " failed to find a creep to collect energy from");
    return false;
  }

  if(harvestingCreep.transferEnergy(creep) != OK){
    creep.moveTo(harvestingCreep);
  }
}
