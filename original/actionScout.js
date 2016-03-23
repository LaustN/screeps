module.exports = function(creep){
  if(creep.memory.scoutTarget){
    creep.say("scouting");
    var scoutTarget = Game.getObjectById(creep.memory.scoutTarget);
    console.log("I found this scoutTarget:" + scoutTarget);
    if(scoutTarget){

      if(creep.pos.roomName == scoutTarget.pos.roomName){
        console.log("I am in the room now!" + scoutTarget);
        return false;
      }

      creep.moveTo(scoutTarget);
      return true;
    }
  }
}
