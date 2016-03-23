module.exports = function(creep){
  if(creep.memory.scoutTarget){
    creep.say("scouting");
    var scoutTarget = Game.getObjectById(creep.memory.scoutTarget);
    creep.say("I found this scoutTarget:" + scoutTarget);
    if(scoutTarget){

      if(creep.pos.room == scoutTarget.room){
        creep.say("I am in the room now!");
        return false;
      }

      creep.moveTo(scoutTarget);
      return true;
    }
  }
}
