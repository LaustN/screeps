module.exports = function(creep){
  var now = Game.time;
  var lastTime = creep.memory.lastHold || now;
  if(lastTime == (now-1)){
    creep.memory.holdDuration++;
  }
  else{
    creep.memory.holdDuration = 0;
  }
  creep.memory.lastHold = now;

  if(holdDuration<50){
    creep.say("holding");
    return true;
  }
  return false;
}
  