module.exports = function(creep){
  var flag = Game.flags[creep.memory.flag];
  if(flag){
    if(creep.pos.roomName != flag.pos.roomName){
      creep.moveTo(flag);
      return true;
    }
    else{
      if(!creep.pos.inRangeTo(flag,3))
      creep.moveTo(flag);
    }
  }
  return false;
}
  