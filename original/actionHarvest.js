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
      var alternativeSource =  creep.pos.findClosestByRange(FIND_SOURCES,{ filter: function(source){ return source.id != harvestTarget.id }});
      if(alternativeSource) {
        console.log(creep.name + " is now targeting " + alternativeSource.pos);
        creep.memory.focus = alternativeSource.id;
      }
    }

    var harvestMessage =  creep.harvest(harvestTarget);
    if(harvestMessage  == ERR_NOT_IN_RANGE) {
      var moveMessage = creep.moveTo(harvestTarget)
      if(moveMessage != OK && moveMessage != ERR_TIRED){
        console.log("Odd move moveMessage:" + moveMessage);
        findOtherSource();
      }
    }
    if(harvestMessage == ERR_NOT_ENOUGH_RESOURCES){
      findOtherSource();
    }
    return true;
  }
}
