module.exports = function(creep){
  var flag = Game.flags[creep.memory.flag];
  if(flag){
    if(creep.pos.room != flag.room){
      creep.moveTo(flag);
      return true;
    }
  }
  else{
    console.log("failed to find flag")
  }
  return false;
}
  