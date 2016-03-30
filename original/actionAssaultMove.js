module.exports = function(creep){
  if(creep.memory.assault){
    var targetFlag = Game.flags[creep.memory.assault];
    if(targetFlag && targetFlag.pos){
      if(creep.pos.roomName != targetFlag.pos.roomName){
        creep.moveTo(targetFlag);
        return true;
      }
    }
  }
}
