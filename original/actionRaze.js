module.exports = function(creep){
  if(creep.memory.razeTarget){
    if(creep.carryCapacity > 0 && _.sum(creep.carry)  == creep.carryCapacity){
      return false; //do not raze on a full stomach
    }
    var razeFlag = Game.flags[razeTarget];
    if(razeFlag){
      var razeRange = 0;
      if(creep.memory.razeRange){
        razeRange = creep.memory.razeRange;
      }
      else {
        creep.memory.razeRange = 0;
      }
      var razeTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(structure){
        if (structure.my) {
          return false;
        }
        if (creep.pos.getRangeTo(structure) <=razeRange) {
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
