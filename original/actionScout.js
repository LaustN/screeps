module.exports = function(creep){
  if(creep.memory.scoutTarget){
    var scoutTarget = Game.getObjectById(creep.memory.scoutTarget);
    if(scoutTarget){
      if(creep.pos.roomName == scoutTarget.pos.roomName){
        return false;
      }
      creep.moveTo(scoutTarget);
      return true;
    }
  }
}
