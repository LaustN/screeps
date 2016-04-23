module.exports = function(creep){
  if(creep.memory.assault){
    var targetFlag = Game.flags[creep.memory.assault];
    if(targetFlag && targetFlag.pos){
      if(targetFlag.pos.roomName != creep.pos.roomName){
        creep.moveTo(targetFlag);
        return true;
      }
    }
  }
}
