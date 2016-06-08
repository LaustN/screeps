module.exports = function(creep){
  var hostilesTooClose = creep.pos.findInRange(FIND_HOSTILE_CREEPS,3);
  var hostilesClose = creep.pos.findInRange(FIND_HOSTILE_CREEPS,4);

  if(hostilesTooClose && hostilesTooClose.length > 0){
    var destination = Game.getObjectById(creep.memory.home);
    if(creep.pos.getRangeTo(destination) <= 2){
        return false;
    }
    creep.moveTo(destination);
    creep.say("flee");
    return true;
  }
  if(hostilesClose && hostilesClose.length > 0){
    creep.moveTo(creep);
    creep.say("hold");
    return true; //just stop where you are, when the enemies are outside actual striking range
  }
}
