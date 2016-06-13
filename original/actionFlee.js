module.exports = function(creep){
  var hostilesTooClose = creep.pos.findInRange(FIND_HOSTILE_CREEPS,3);

  if(hostilesTooClose && hostilesTooClose.length > 0){
    var destination = Game.getObjectById(creep.memory.home);
    if(creep.pos.getRangeTo(destination) <= 2){
        return false;
    }
    creep.moveTo(destination);
    creep.say("flee");
    return true;
  }
}
