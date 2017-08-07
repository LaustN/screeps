module.exports = function(creep){
  if (creep.memory.holdDuration<100) {

    if(creep.memory.lastHoldTick == Game.time-1){
      creep.memory.lastHoldTick = Game.time;
      creep.memory.holdDuration ++;
      return true;
    }
    else{
      creep.memory.holdDuration = 0;
      return false;
    }
  }
}
