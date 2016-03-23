module.exports = function(creep){
  var harvestTarget = creep.room.find(FIND_SOURCES)[0];

  if(creep.memory.focus) {
    var focus = Game.getObjectById(creep.memory.focus);
    if(focus){
      harvestTarget = focus.pos.findClosestByRange(FIND_SOURCES);
    }
  }

  var harvestMessage =  creep.harvest(harvestTarget);
  if(harvestMessage  == ERR_NOT_IN_RANGE) {
    var moveMessage = creep.moveTo(harvestTarget)
    if(moveMessage != OK && moveMessage != ERR_TIRED){
      var alternativeSource =  creep.pos.findClosestByRange(FIND_SOURCES,{ filter: function(source){ return source.id != harvestTarget.id }});
      if(alternativeSource) {
        console.log(creep.name + " is now targeting " + alternativeSource.pos);
        creep.memory.focus = alternativeSource.id;
      }

    }
  }
}
