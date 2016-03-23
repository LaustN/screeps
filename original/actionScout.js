module.exports = function(creep){
  if(creep.memory.scoutTarget){
    var scoutTarget = Game.getObjectById(creep.memory.scoutTarget);
    if(scoutTarget){

      if(creep.pos.room == scoutTarget.room){
        return false;
      }

      creep.moveTo(scoutTarget);
      return true;
    }
  }
}
