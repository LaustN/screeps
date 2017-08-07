module.exports = function(creep){
  creep.say("cosider holding");
  if (typeof(creep.memory.holdDuration) == "undefined" || creep.memory.holdDuration<100) {

    if (typeof(creep.memory.lastHoldTick) == "undefined"){
      creep.memory.lastHoldTick = Game.time;
      creep.say("initial hold time");
    }

    if(creep.memory.lastHoldTick >= Game.time-1){
      creep.memory.lastHoldTick = Game.time;
      creep.memory.holdDuration ++;
      creep.say("holding");
      return true;
    }
    else{
      creep.say("no longer holding");
      creep.memory.holdDuration = 0;
      return false;
    }
  }
}
