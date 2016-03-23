module.exports = function(creep){
  if(creep.memory.scoutTarget){
    console.log("scouting");
    var scoutTarget = Game.getObjectById(creep.memory.scoutTarget);
    console.log("I found this scoutTarget:" + scoutTarget);
    if(scoutTarget){

      if(creep.pos.room == scoutTarget.pos.room){
        console.log("I am in the room now!");
        return false;
      }

      creep.moveTo(scoutTarget);
      return true;
    }
  }
}
