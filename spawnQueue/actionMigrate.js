module.exports = function(creep){
  var flag = Game.flags[creep.memory.flag];
  if(flag){
    if(creep.pos.roomName != flag.pos.roomName){
      creep.moveTo(flag);
      return true;
    }
  }
  return false;
}
  