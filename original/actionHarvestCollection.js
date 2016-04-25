module.exports = function(creep){

  //check that creep is not full
  //find workers that are less than 100% AND next to a harvest source
  //move to closest of those
  //transfer resources
  if(creep.carryCapacity == creep.carry.energy){
    return false;
  }

  var getFocusObject = function(creepWithFocus){
    var focusObject = Game.getObjectById(creepWithFocus.memory.focus);
    if (!focusObject) {
      focusObject = Game.creeps[creepWithFocus.memory.focus];
    }
    if (!focusObject) {
      focusObject = creepWithFocus;
    }
    return focusObject;
  }

  var findFullHavestingCreep = function(fullness){
    var focusObject = getFocusObject(creep);
    var harvestingCreeps =
    focusObject.pos.findInRange(FIND_MY_CREEPS,5,
      { filter : function(filterCreep){
        if(filterCreep.memory.role == "harvester"
            && filterCreep.carry.energy / filterCreep.carryCapacity >= fullness
          ){
          return true;
        }
        return false;
      }
    });
    if(harvestingCreeps && harvestingCreeps.length>0){
      return harvestingCreeps[0];
    }
    return null;
  }

  var wantedFullness = 1;
  var harvestingCreep = null;
  while (wantedFullness >= 0  && harvestingCreep == null) {
    harvestingCreep = findFullHavestingCreep(wantedFullness);
    wantedFullness-= 0.5;
  }


  if(!harvestingCreep){
    creep.say("C?");
    creep.moveTo(getFocusObject(creep));
  }

  if (harvestingCreep) {
    if(harvestingCreep.transferEnergy(creep) != OK){
      creep.moveTo(harvestingCreep);
    }
  }
}
