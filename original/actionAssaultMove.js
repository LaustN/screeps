module.exports = function(creep){
  if(creep.memory.assault){
    var targetFlag = Game.flags[creep.memory.assault];
    if(targetFlag && targetFlag.pos){
      creep.moveTo(targetFlag);
      return true;
    }
  }
}
