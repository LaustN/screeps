module.exports = function(creep){
  if(creep.carryCapacity == creep.carry.energy){
    return false;
  }

  var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
  if(target) {
      if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
      }
      console.log(creep.name + " is scavenging at " + target.pos);
      return true;
  }
}
