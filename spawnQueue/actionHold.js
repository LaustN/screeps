module.exports = function(creep){
  var now = Game.time;
  var lastTime = now;
  if(creep.memory.lastHold){
    lastTime = creep.memory.lastHold;
  }
  if(lastTime == (now-1)){
    creep.memory.holdDuration++;
  }
  else{
    creep.memory.holdDuration = 0;
  }
  creep.memory.lastHold = now;

  if(creep.memory.holdDuration<50){
    creep.say("holding");
    return true;
  }
  return false;
}
  