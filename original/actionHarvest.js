module.exports = function(creep){

  if(creep.carry[RESOURCE_ENERGY] == 0){
    creep.memory.harvest = true;
  }
  if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity){
    creep.memory.harvest = false;
  }

  if(creep.memory.harvest == true){

    var harvestTarget = creep.room.find(FIND_SOURCES)[0];
    if(creep.memory.focus != null){
      var focus = Game.getObjectById(creep.memory.focus);
      if(focus != null && focus.pos.roomName == harvestTarget.pos.roomName
        console.log("setting harvestTarget to focus object at " + focus.pos);
        harvestTarget = focus;
      }
    }

    var findOtherSource = function(){
      var alternativeSource =  creep.pos.findClosestByRange(FIND_SOURCES,{ filter:
        function(source){
          if (source.id == harvestTarget.id) {
            return false; //do not accept the source currently in focus
          }
          if(source.energy == 0){
            return false; //do not accept empty sources
          }

          for (var xIterator = -1; xIterator <= 1; xIterator++) {
            for (var yIterator = -1; yIterator <= 1; yIterator++) {
              var checkPos = new RoomPosition(source.pos.x + xIterator, source.pos.y + yIterator, source.pos.roomName);
              var terrain = checkPos.lookFor("terrain");
              if(terrain == "plain" || terrain == "swamp"){
                var creepsAtCheckPos = checkPos.lookFor("creep");
                if(creepsAtCheckPos.length == 0){
                  return true;
                }
              }
            }
          }
          return source.id != harvestTarget.id ;
        }});
      if(alternativeSource) {
        console.log(creep.name + " shifting focus to source at " + alternativeSource.pos);
        creep.memory.focus = alternativeSource.id;
      }
    }

    var harvestMessage =  creep.harvest(harvestTarget);
    if(harvestMessage  == ERR_NOT_IN_RANGE) {
      var moveMessage = creep.moveTo(harvestTarget)
      if(moveMessage != OK && moveMessage != ERR_TIRED){
        creep.say("Move:" + moveMessage);
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
