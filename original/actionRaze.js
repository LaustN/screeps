module.exports = function(creep){
  if(creep.memory.razeTarget){
    if(creep.carryCapacity > 0 && _.sum(creep.carry)  == creep.carryCapacity){
      return false; //do not raze on a full stomach
    }
    var razeFlag = Game.flags[creep.memory.razeTarget];
    if(razeFlag != null){
      var razeRange = 0;
      if(creep.memory.razeRange){
        razeRange = creep.memory.razeRange;
      }
      else {
        creep.memory.razeRange = 0;
      }
      var razeTarget = razeFlag.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(structure){
        if (structure.my) {
          return false;
        }
        if (razeFlag.pos.getRangeTo(structure) <=razeRange) {
          return true;
        }
        return false;
      }});
      if(razeTarget){
        creep.moveTo(razeTarget);
        creep.dismantle(razeTarget);
        creep.attack(razeTarget);
        return true;
      }
    }
  }
  else {
    creep.memory.razeTarget = "[Name of a flag]";
  }
}
