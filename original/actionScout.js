module.exports = function(creep){
  if(creep.memory.focus){
    var scoutTarget = Game.getObjectById(creep.memory.focus);
    if(scoutTarget){
      if(creep.pos.roomName == scoutTarget.pos.roomName){
        return false;
      }
      creep.moveTo(scoutTarget);
      return true;
    }
  }
}
