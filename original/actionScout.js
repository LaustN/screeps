module.exports = function(creep){
  if(creep.memory.focus){
    if (creep.carry.energy == creep.carryCapacity) {
      return false;  //do not scout on a full stomach
    }
    var scoutTarget = Game.getObjectById(creep.memory.focus);
    if(scoutTarget){
      if(creep.pos.roomName == scoutTarget.pos.roomName){
        return false;
      }
      creep.moveTo(scoutTarget);
      return true;
    }
  }
}
