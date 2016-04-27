module.exports = function(creep){

  if(creep.carry.energy == 0){
    creep.memory.harvest = true;
  }
  if(creep.carry.energy == creep.carryCapacity){
    creep.memory.harvest = false;
  }

  if(creep.memory.harvest == true){

    var harvestTarget = creep.room.find(FIND_SOURCES)[0];

    if(creep.memory.focus) {
      var focus = Game.getObjectById(creep.memory.focus);
      if(focus){
        if (focus.pos.roomName != creep.pos.roomName) {
          creep.moveTo(focus);
          return true;
        }
        try{
          harvestTarget = focus.pos.findClosestByRange(FIND_SOURCES);
        }
        catch(e){
          creep.say(e);
          console.log(e);
        }
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
                  console.log("Found " + terrain + " at " checkPos + " and no creeps");
                  return true;
                }
              }
            }
          }
          return source.id != harvestTarget.id ;
        }
      });
      if(alternativeSource) {
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
}
