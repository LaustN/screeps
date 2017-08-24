module.exports = function(creep){
  var focusObject = Game.getObjectById(creep.memory.focus);
  if(focusObject){
    var harvestMessage = creep.harvest(focusObject)
    if(harvestMessage == ERR_NOT_IN_RANGE){
      creep.moveTo(focusObject);
    }
    else{
      console.log("unexpected harvest message from " + creep.name + " at " + JSON.stringify(creep.pos) + ": " + harvestMessage);
    }
    return true;
  }
  return false;
}
  