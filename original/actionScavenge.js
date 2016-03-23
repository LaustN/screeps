module.exports = function(creep){
  if(creep.carryCapacity == creep.carry.energy){
    return false;
  }

  var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
  if(target) {
      if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
      }
      creep.say("S" + target.pos.x + ";" + target.pos.y);
      return true;
  }
}
