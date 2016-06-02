module.exports = function(creep){

  if(creep.carry[RESOURCE_ENERGY] == 0){
    creep.memory.harvest = true;
  }
  if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity){
    creep.memory.harvest = false;
  }

  if(creep.memory.harvest == true){

    var harvestTarget = null;
    if(creep.memory.focus != null){
      var focus = Game.getObjectById(creep.memory.focus);
      if(focus != null && focus.pos.roomName == harvestTarget.pos.roomName){
        harvestTarget = focus;
      }
    }
    if(!harvestTarget){
      harvestTarget = creep.pos.findClosestByRange(FIND_SOURCES);
    }

    var findOtherSource = function(){
      var nonFocusSources = creep.room.find(FIND_SOURCES, { filter: function(source){ return source.id != creep.memory.focus && source.energy != 0}});
      var nearbyCreepCount = 10;
      var bestSource = null;
      for (var sourceKey in nonFocusSources) {
        var source = nonFocusSources[sourceKey];
        var nearbyCreeps = source.pos.findInRange(FIND_MY_CREEPS, 1, {filter: function(nearbyCreep){ return nearbyCreep.getActiveBodyparts(WORK) > 0; } })
        if(nearbyCreeps.length < nearbyCreepCount){
          nearbyCreepCount = nearbyCreeps.length;
          bestSource = source;
        }
      }
      if(bestSource){
        creep.memory.focus = bestSource.id;
      }
    }

    var harvestMessage =  creep.harvest(harvestTarget);
    if(harvestMessage  == ERR_NOT_IN_RANGE) {
      var moveMessage = creep.moveTo(harvestTarget)
      if(moveMessage == ERR_NO_PATH){
        creep.say("No path");
        findOtherSource();
      }
    }
    if(harvestMessage == ERR_NOT_ENOUGH_RESOURCES){
      findOtherSource();
    }

    return true;
  }
  return false;
}
