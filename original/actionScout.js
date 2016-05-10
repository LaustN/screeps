module.exports = function(creep){
  if(creep.memory.focus){
    if (creep.memory.dropoff) {
      return false; //do not run to remote rooms for dropoff
    }

    if (creep.carry.energy == creep.carryCapacity) {
      return false;  //do not scout on a full stomach
    }
    var scoutTarget = Game.flags[creep.memory.scoutFlag];

    //reset focus to null when moving like a scout, hopefully making scouts not get stuck at room borders
    creep.memory.focus = null;

    if(scoutTarget){
      if(creep.pos.roomName == scoutTarget.pos.roomName){
        return false;
      }
      if(creep.carry.energy){
        console.log("maybe " + creep.name + " should drop energy at " + creep.pos);
        creep.drop(RESOURCE_ENERGY);
      }
      creep.moveTo(scoutTarget);
      return true;
    }
  }
}
