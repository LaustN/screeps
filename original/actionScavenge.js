module.exports = function(creep){


  if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity){
    creep.memory.scavenging = false;
  }
  if(creep.carry[RESOURCE_ENERGY] == 0){
    creep.memory.scavenging = true;
  }

  if(creep.memory.scavenging){
    var scavengeRange = 1;
    if(creep.memory.scavengeRange){
      scavengeRange = creep.memory.scavengeRange;
    }

    var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
    if(target && target.pos.getRangeTo(creep) <= scavengeRange) {
        if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        creep.say("S" + (target.pos.x - creep.pos.x) + ";" + (target.pos.y - creep.pos.y));
        return true;
    }
    creep.memory.scavenging = false;
    return false;
  }
}
